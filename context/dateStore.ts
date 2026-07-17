import { create } from "zustand";

type DateState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const useDateStore = create<DateState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
