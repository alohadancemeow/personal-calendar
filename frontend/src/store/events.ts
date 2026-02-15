
import { create } from 'zustand';
import { type Event } from '@/types';
import { apiFetch } from '@/lib/api';
import { format } from "date-fns";

interface EventsState {
    events: Event[];
    isLoading: boolean;
    error: string | null;
    refreshTrigger: number;
    fetchEvents: (date: Date) => Promise<void>;
    triggerRefresh: () => void;
}

export const useEventsStore = create<EventsState>((set) => ({
    events: [],
    isLoading: false,
    error: null,
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
    fetchEvents: async (date: Date) => {
        set({ isLoading: true, error: null });
        try {
            const formattedDate = format(date, "yyyy-MM-dd");
            const response = await apiFetch(`/events/?date=${formattedDate}`);

            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }

            const data = await response.json();
            set({ events: data, isLoading: false, error: null });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },
}));
