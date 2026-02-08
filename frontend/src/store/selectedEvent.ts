import { create } from 'zustand';
import { type Event } from '@/types';

interface SelectedEventState {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  clearSelectedEvent: () => void;
}

export const useSelectedEventStore = create<SelectedEventState>((set) => ({
  selectedEvent: null,
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  clearSelectedEvent: () => set({ selectedEvent: null }),
}));