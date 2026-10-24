import { z } from 'zod';

export const highlightInputSchema = z.strictObject({
  projectId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  owner: z
    .string()
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/)
    .transform((value) => value.toLowerCase()),
  repo: z
    .string()
    .regex(/^[a-zA-Z0-9_.-]{1,100}$/)
    .refine((value) => value !== '.' && value !== '..')
    .transform((value) => value.toLowerCase()),
});

export const highlightsInputSchema = z
  .array(highlightInputSchema)
  .max(24)
  .superRefine((items, context) => {
    if (
      new Set(items.map((item) => item.projectId)).size !== items.length ||
      new Set(items.map((item) => `${item.owner}/${item.repo}`)).size !==
        items.length
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Não repita repositórios nos destaques.',
      });
    }
  });

export const messageSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  createdAt: z.iso.datetime({ offset: true }),
  respondedAt: z.iso.datetime({ offset: true }).nullable(),
  notificationStatus: z.enum(['pending', 'accepted', 'failed']),
});
