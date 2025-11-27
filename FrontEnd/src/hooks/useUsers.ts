import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  updated_at: string;
}

export const useUsers = () => {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';

  const query = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin, // Only fetch if admin
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id' | 'updated_at'>) => supabase.from('profiles').insert(newUser).select().single(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: Partial<User> & { id: string }) =>
      supabase.from('profiles').update(updates).eq('id', id).select().single(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supabase.from('profiles').delete().eq('id', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return { query, createMutation, updateMutation, deleteMutation };
};

export const useCurrentUser = () => useQuery<User>({
  queryKey: ['currentUser'],
  queryFn: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No user');
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (!data) throw new Error('Profile not found');
    return data;
  },
  staleTime: 5 * 60 * 1000,
});