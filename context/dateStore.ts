// store/useFoodDiaryStore.ts
import { create } from "zustand";

type DateState = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

function getTodayDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: getTodayDateString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
