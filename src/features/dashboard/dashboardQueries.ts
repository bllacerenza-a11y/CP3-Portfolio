import { queryOptions } from '@tanstack/react-query';
import { fetchHighlights, fetchMessages } from '../../services/dashboard';

export const highlightsOptions = () =>
  queryOptions({
    queryKey: ['highlights'],
    queryFn: ({ signal }) => fetchHighlights(signal),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
export const messagesOptions = (userId: string, offset: number) =>
  queryOptions({
    queryKey: ['messages', userId, offset],
    queryFn: ({ signal }) => fetchMessages(offset, signal),
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });
