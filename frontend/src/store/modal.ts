import { create } from 'zustand'


import { type Event } from '@/types';

interface ModalState {
    isOpen: boolean;
    eventToEdit: Event | null;
    openModal: (event?: Event) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    eventToEdit: null,
    openModal: (event) => set({ isOpen: true, eventToEdit: event || null }),
    closeModal: () => set({ isOpen: false, eventToEdit: null }),
}));
