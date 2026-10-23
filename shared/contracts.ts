/** Contratos iniciais T01. Implementações e validação de entrada vêm em T03–T05. */
export interface Project {
  id: number;
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  htmlUrl: string;
  homepage: string | null;
  updatedAt: string;
}

export interface ContactSubmission {
  submissionId: string;
  name: string;
  email: string;
  message: string;
}

export type ContactField = 'name' | 'email' | 'message';

export type ContactResult =
  | { status: 'notified'; messageId: string }
  | { status: 'saved_notification_failed'; messageId: string }
  | { status: 'invalid'; fields: Partial<Record<ContactField, string>> }
  | { status: 'failed'; retryable: boolean };

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  respondedAt: string | null;
  notificationStatus: 'pending' | 'accepted' | 'failed';
}

export interface Highlight {
  projectId: number;
  owner: string;
  repo: string;
  position: number;
}
