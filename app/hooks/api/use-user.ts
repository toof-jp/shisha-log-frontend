import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '~/lib/user';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
}