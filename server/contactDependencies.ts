import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { ContactDependencies } from './contact.js';

const saveResultSchema = z.discriminatedUnion('outcome', [
  z.object({ outcome: z.literal('limited') }),
  z.object({ outcome: z.literal('conflict') }),
  z.object({
    outcome: z.enum(['created', 'existing']),
    id: z.uuid(),
    notificationStatus: z.enum(['pending', 'accepted', 'failed']),
  }),
]);

export const contactEnvironmentSchema = z.object({
  SUPABASE_URL: z.url().refine((value) => new URL(value).protocol === 'https:'),
  SUPABASE_SECRET_KEY: z.string().min(20),
  CONTACT_RATE_LIMIT_SECRET: z.string().min(32),
  CONTACT_ALLOWED_ORIGINS: z
    .string()
    .transform((value) => value.split(',').map((origin) => origin.trim()))
    .pipe(
      z
        .array(z.url().refine((origin) => new URL(origin).origin === origin))
        .min(1),
    ),
  RESEND_API_KEY: z.string().min(10).optional(),
  CONTACT_FROM_EMAIL: z.email().optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
});

export function createContactDependencies(
  env: NodeJS.ProcessEnv,
  fetcher: typeof fetch = fetch,
): ContactDependencies {
  const config = contactEnvironmentSchema.parse(env);
  const client = createClient(config.SUPABASE_URL, config.SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options) =>
        fetcher(url, { ...options, signal: AbortSignal.timeout(8000) }),
    },
  });
  return {
    allowedOrigins: config.CONTACT_ALLOWED_ORIGINS,
    async save(submission, clientIp) {
      const bucket = createHmac('sha256', config.CONTACT_RATE_LIMIT_SECRET)
        .update(clientIp)
        .digest('hex');
      const { data, error } = await client.rpc('save_contact', {
        p_submission_id: submission.submissionId,
        p_name: submission.name,
        p_email: submission.email,
        p_message: submission.message,
        p_bucket: bucket,
      });
      if (error) throw new Error('Contact persistence unavailable');
      return saveResultSchema.parse(data);
    },
    async notify(submission, messageId) {
      if (
        !config.RESEND_API_KEY ||
        !config.CONTACT_FROM_EMAIL ||
        !config.CONTACT_TO_EMAIL
      )
        throw new Error('Email not configured');
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `contact/${messageId}`,
        },
        body: JSON.stringify({
          from: config.CONTACT_FROM_EMAIL,
          to: [config.CONTACT_TO_EMAIL],
          reply_to: submission.email,
          subject: 'Nova mensagem no portfólio',
          text: `Nome: ${submission.name}\nE-mail: ${submission.email}\n\n${submission.message}\n\nReferência: ${messageId}`,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (
        !response.ok ||
        !z.object({ id: z.string().min(1) }).safeParse(await response.json())
          .success
      ) {
        throw new Error('Email not accepted');
      }
    },
    async setNotificationStatus(messageId, status) {
      const { data, error } = await client
        .from('messages')
        .update({ notification_status: status })
        .eq('id', messageId)
        .eq('notification_status', 'pending')
        .select('id')
        .single();
      if (error || !data) throw new Error('Notification status unavailable');
    },
  };
}
