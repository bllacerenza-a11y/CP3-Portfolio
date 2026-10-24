import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './Field.module.css';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
} & (
  | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

export function Field({ label, hint, error, id, ...props }: FieldProps) {
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
    undefined;
  const common = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': Boolean(error),
  };
  let control;
  if (props.multiline) {
    const { multiline, ...attributes } = props;
    void multiline;
    control = <textarea {...attributes} {...common} />;
  } else {
    const { multiline, ...attributes } = props;
    void multiline;
    control = <input {...attributes} {...common} />;
  }
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {control}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <span id={`${id}-error`} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}
