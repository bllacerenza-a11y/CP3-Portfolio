import { z } from 'zod';
import type { ContactResult, ContactSubmission } from '../../shared/contracts';
import { contactSchema } from '../../shared/schemas/contact';

const resultSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('notified'), messageId: z.uuid() }),
  z.object({
    status: z.literal('saved_notification_failed'),
    messageId: z.uuid(),
  }),
  z.object({
    status: z.literal('saved_notification_pending'),
    messageId: z.uuid(),
  }),
  z.object({
    status: z.literal('invalid'),
    fields: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      message: z.string().optional(),
    }),
  }),
  z.object({ status: z.literal('failed'), retryable: z.boolean() }),
]);

export async function submitContact(
  submission: ContactSubmission,
  signal?: AbortSignal,
): Promise<ContactResult> {
  const payload = contactSchema.parse(submission);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
    const result = resultSchema.safeParse(await response.json());
    if (!result.success) return { status: 'failed', retryable: true };
    const expectedCodes = {
      notified: 201,
      saved_notification_failed: 202,
      saved_notification_pending: 202,
      invalid: 400,
    };
    if (
      result.data.status !== 'failed' &&
      response.status !== expectedCodes[result.data.status]
    )
      return { status: 'failed', retryable: true };
    return result.data;
  } catch {
    return { status: 'failed', retryable: true };
  }
}
