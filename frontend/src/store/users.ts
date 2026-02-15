import { create } from 'zustand';
import { type User } from '@/types';
import { apiFetch } from '@/lib/api';

interface UsersState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
    users: [],
    isLoading: false,
    error: null,
    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiFetch('/users/', {
                method: 'GET',
                // apiFetch handles Content-Type: application/json by default
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            // data is UserResponse[], need to map to User type if they differ
            // UserResponse: { id: int, username: str, email: str, image: str }
            // User type: { id: string, name: string, email: string, image: string, avatar?: string }

            const fetchedUsers: User[] = (data as any[]).map((u: any) => ({
                id: String(u.id),
                username: u.username,
                email: u.email,
                image: u.image || '',
            }));

            set({ users: fetchedUsers, isLoading: false, error: null });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },
}));
