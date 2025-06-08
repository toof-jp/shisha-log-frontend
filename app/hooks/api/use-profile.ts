import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api-client';
import type { Profile } from '~/types/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get<Profile>('/profiles/me');
      return data;
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (displayName: string) => {
      const { data } = await apiClient.post<Profile>('/profiles', {
        display_name: displayName,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (displayName: string) => {
      const { data } = await apiClient.put('/profiles/me', {
        display_name: displayName,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}