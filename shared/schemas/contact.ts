import { z } from 'zod';
import type { ContactField } from '../contracts.js';

export const contactSchema = z.strictObject({
  submissionId: z.uuid('Identificador de envio inválido.'),
  name: z
    .string()
    .trim()
    .min(2, 'Informe pelo menos 2 caracteres.')
    .max(100, 'Use até 100 caracteres.'),
  email: z
    .string()
    .trim()
    .max(254, 'Use até 254 caracteres.')
    .pipe(z.email('Informe um e-mail válido.')),
  message: z
    .string()
    .trim()
    .min(10, 'Escreva pelo menos 10 caracteres.')
    .max(5000, 'Use até 5000 caracteres.'),
});

export function contactFieldErrors(
  error: z.ZodError,
): Partial<Record<ContactField, string>> {
  const fields: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === 'name' || field === 'email' || field === 'message') &&
      !fields[field]
    ) {
      fields[field] = issue.message;
    }
  }
  return fields;
}
