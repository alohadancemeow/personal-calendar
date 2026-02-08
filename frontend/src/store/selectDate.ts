import { create } from 'zustand';

interface SelectDateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const useSelectDateStore = create<SelectDateState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));