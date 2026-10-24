import { z } from 'zod';
import type {
  Highlight,
  HighlightInput,
  Message,
} from '../../shared/contracts';
import {
  highlightsInputSchema,
  messageSchema,
} from '../../shared/schemas/dashboard';
import { getSupabase } from './supabase';

const messageColumns =
  'id,name,email,message,created_at,responded_at,notification_status';

export class DashboardError extends Error {
  constructor() {
    super(
      'Não foi possível acessar os dados. Verifique sua sessão e tente novamente.',
    );
  }
}

export async function fetchMessages(
  offset = 0,
  signal?: AbortSignal,
): Promise<Message[]> {
  if (!Number.isSafeInteger(offset) || offset < 0) throw new DashboardError();
  let query = getSupabase()
    .from('messages')
    .select(messageColumns)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + 49);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error || !data) throw new DashboardError();
  return data.map((row) =>
    messageSchema.parse({
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      createdAt: row.created_at,
      respondedAt: row.responded_at,
      notificationStatus: row.notification_status,
    }),
  );
}

export async function markMessageResponded(
  messageId: string,
  responded: boolean,
): Promise<Message> {
  z.uuid().parse(messageId);
  const { data, error } = await getSupabase()
    .from('messages')
    .update({ responded_at: responded ? new Date().toISOString() : null })
    .eq('id', messageId)
    .select(messageColumns)
    .single();
  if (error || !data) throw new DashboardError();
  return messageSchema.parse({
    id: data.id,
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: data.created_at,
    respondedAt: data.responded_at,
    notificationStatus: data.notification_status,
  });
}

export async function fetchHighlights(
  signal?: AbortSignal,
): Promise<Highlight[]> {
  let query = getSupabase()
    .from('highlights')
    .select('project_id,owner,repo,position')
    .order('position');
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error || !data) throw new DashboardError();
  return z
    .array(
      z.object({
        projectId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
        owner: z.string(),
        repo: z.string(),
        position: z.number().int().nonnegative(),
      }),
    )
    .parse(
      data.map((row) => ({
        projectId: row.project_id,
        owner: row.owner,
        repo: row.repo,
        position: row.position,
      })),
    );
}

export async function replaceHighlights(
  items: HighlightInput[],
): Promise<void> {
  const { error } = await getSupabase().rpc('replace_highlights', {
    p_highlights: highlightsInputSchema.parse(items),
  });
  if (error) throw new DashboardError();
}
