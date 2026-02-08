import { create } from 'zustand';

type EventType = 'meeting' | 'task' | 'reminder' | 'appointment' | null;

interface EventTypeState {
  selectedType: EventType;
  setEventType: (type: EventType) => void;
}

export const useEventTypeStore = create<EventTypeState>((set) => ({
  selectedType: null,
  setEventType: (type) => set({ selectedType: type }),
}));