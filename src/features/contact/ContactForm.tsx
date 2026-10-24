import { useEffect, useRef, useState } from 'react';
import type { ContactField, ContactResult } from '../../../shared/contracts';
import {
  contactFieldErrors,
  contactSchema,
} from '../../../shared/schemas/contact';
import { submitContact } from '../../services/contact';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import styles from './ContactForm.module.css';

const empty = { name: '', email: '', message: '' };
export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>(
    {},
  );
  const [result, setResult] = useState<ContactResult | null>(null);
  const [sending, setSending] = useState(false);
  const attempt = useRef<{ id: string; content: string } | null>(null);
  const request = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => () => request.current?.abort(), []);
  const saved =
    result?.status === 'saved_notification_failed' ||
    result?.status === 'saved_notification_pending';
  const blocked = saved || (result?.status === 'failed' && !result.retryable);

  async function send() {
    if (request.current || blocked) return;
    const content = JSON.stringify(values);
    if (!attempt.current || attempt.current.content !== content) {
      attempt.current = { id: crypto.randomUUID(), content };
    }
    const parsed = contactSchema.safeParse({
      ...values,
      submissionId: attempt.current.id,
    });
    if (!parsed.success) {
      setErrors(contactFieldErrors(parsed.error));
      setResult({
        status: 'invalid',
        fields: contactFieldErrors(parsed.error),
      });
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setSending(true);
    setErrors({});
    setResult(null);
    try {
      const next = await submitContact(parsed.data, controller.signal);
      if (controller.signal.aborted) return;
      setResult(next);
      if (next.status === 'invalid') {
        setErrors(next.fields);
        requestAnimationFrame(() =>
          form.current
            ?.querySelector<HTMLElement>('[aria-invalid="true"]')
            ?.focus(),
        );
      }
      if (next.status === 'notified') {
        setValues(empty);
        attempt.current = null;
      }
    } catch {
      if (!controller.signal.aborted)
        setResult({ status: 'failed', retryable: true });
    } finally {
      if (!controller.signal.aborted) setSending(false);
      request.current = null;
    }
  }
  return (
    <form
      ref={form}
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void send();
      }}
      aria-busy={sending}
    >
      <p>
        Deixe uma mensagem sobre os projetos ou uma oportunidade de conversa.
      </p>
      <fieldset disabled={sending || blocked}>
        <legend className={styles.legend}>Sua mensagem</legend>
        {(['name', 'email', 'message'] as const).map((field) => {
          const shared = {
            id: `contact-${field}`,
            name: field,
            required: true,
            label: { name: 'Nome', email: 'E-mail', message: 'Mensagem' }[
              field
            ],
            error: errors[field],
            value: values[field],
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => {
              setValues({ ...values, [field]: event.target.value });
              setErrors({ ...errors, [field]: undefined });
              setResult(null);
            },
          };
          return field === 'message' ? (
            <Field
              key={field}
              {...shared}
              multiline
              maxLength={5000}
              hint="De 10 a 5000 caracteres."
            />
          ) : (
            <Field
              key={field}
              {...shared}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field}
              maxLength={field === 'name' ? 100 : 254}
            />
          );
        })}
      </fieldset>
      {sending && <p role="status">Enviando mensagem…</p>}
      {result && (
        <p
          role={
            result.status === 'invalid' || result.status === 'failed'
              ? 'alert'
              : 'status'
          }
        >
          {result.status === 'notified' &&
            'Mensagem salva; notificação aceita pelo serviço de e-mail. Isso não confirma a entrega na caixa de entrada.'}
          {result.status === 'saved_notification_failed' &&
            'Mensagem salva, mas não foi possível confirmar a notificação. O e-mail não será reenviado automaticamente.'}
          {result.status === 'saved_notification_pending' &&
            'Mensagem salva; confirmação da notificação pendente. O e-mail não será reenviado automaticamente.'}
          {result.status === 'invalid' &&
            'Revise os campos indicados. Não foi possível enviar a mensagem.'}
          {result.status === 'failed' &&
            (result.retryable
              ? 'Não foi possível confirmar o envio. Seus campos foram mantidos; tente novamente com a mesma mensagem.'
              : 'Este envio foi recusado. Seus campos foram mantidos. Revise o conteúdo antes de iniciar outra tentativa.')}
        </p>
      )}
      {!blocked && (
        <Button type="submit" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar mensagem'}
        </Button>
      )}
      {blocked && (
        <Button
          variant="quiet"
          onClick={() => {
            setValues(empty);
            setErrors({});
            setResult(null);
            attempt.current = null;
            requestAnimationFrame(() =>
              form.current?.querySelector<HTMLInputElement>('input')?.focus(),
            );
          }}
        >
          Escrever outra mensagem
        </Button>
      )}
    </form>
  );
}
