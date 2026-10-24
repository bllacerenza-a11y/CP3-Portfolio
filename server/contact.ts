import type { ContactResult, ContactSubmission } from '../shared/contracts';
import { contactFieldErrors, contactSchema } from '../shared/schemas/contact';

export type SaveResult =
  | { outcome: 'limited' | 'conflict' }
  | {
      outcome: 'created' | 'existing';
      id: string;
      notificationStatus: 'pending' | 'accepted' | 'failed';
    };

export interface ContactDependencies {
  allowedOrigins: readonly string[];
  save: (
    submission: ContactSubmission,
    clientIp: string,
  ) => Promise<SaveResult>;
  notify: (submission: ContactSubmission, messageId: string) => Promise<void>;
  setNotificationStatus: (
    messageId: string,
    status: 'accepted' | 'failed',
  ) => Promise<void>;
}

export interface ContactRequest {
  method: string;
  origin?: string;
  contentType?: string;
  clientIp?: string;
  body: unknown;
}

export interface ContactResponse {
  statusCode: number;
  body: ContactResult;
  headers?: Record<string, string>;
}

const failed = (statusCode: number, retryable: boolean): ContactResponse => ({
  statusCode,
  body: { status: 'failed', retryable },
});

export async function handleContact(
  request: ContactRequest,
  deps: ContactDependencies,
): Promise<ContactResponse> {
  if (request.method !== 'POST')
    return { ...failed(405, false), headers: { Allow: 'POST' } };
  if (!request.origin || !deps.allowedOrigins.includes(request.origin))
    return failed(403, false);
  if (
    request.contentType?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  )
    return failed(415, false);
  if (!request.clientIp) return failed(503, true);
  const parsed = contactSchema.safeParse(request.body);
  if (!parsed.success) {
    return {
      statusCode: 400,
      body: { status: 'invalid', fields: contactFieldErrors(parsed.error) },
    };
  }
  try {
    const saved = await deps.save(parsed.data, request.clientIp);
    if (saved.outcome === 'limited')
      return { ...failed(429, true), headers: { 'Retry-After': '3600' } };
    if (saved.outcome === 'conflict') return failed(409, false);
    if (!('id' in saved)) return failed(503, true);
    if (saved.outcome === 'existing') {
      if (saved.notificationStatus === 'accepted')
        return {
          statusCode: 201,
          body: { status: 'notified', messageId: saved.id },
        };
      return {
        statusCode: 202,
        body: {
          status:
            saved.notificationStatus === 'failed'
              ? 'saved_notification_failed'
              : 'saved_notification_pending',
          messageId: saved.id,
        },
      };
    }
    let status: 'accepted' | 'failed' = 'accepted';
    try {
      await deps.notify(parsed.data, saved.id);
    } catch {
      status = 'failed';
    }
    try {
      await deps.setNotificationStatus(saved.id, status);
    } catch {
      // Persisted, provider outcome may be ambiguous. Never resend on a public retry.
      return {
        statusCode: 202,
        body: { status: 'saved_notification_pending', messageId: saved.id },
      };
    }
    return status === 'accepted'
      ? { statusCode: 201, body: { status: 'notified', messageId: saved.id } }
      : {
          statusCode: 202,
          body: { status: 'saved_notification_failed', messageId: saved.id },
        };
  } catch {
    return failed(503, true);
  }
}
