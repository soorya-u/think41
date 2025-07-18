import { create } from "zustand";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type TEventStore = {
  startDate: Date | undefined,
  noOfOccurances: number
  day:  number,
  filterStartDate: Date | undefined,
  filterEndDate: Date | undefined,
  setStartDate: (date: Date | undefined) => void
  setNoOfOccurances: (occ: number) => void
  setDay: (day:  number) => void,
  setFilterStartDate: (date:Date | undefined) => void
  setFilterEndDate: (date:Date | undefined) => void
}

export const useEventStore = create<TEventStore>((set) => ({
  startDate: new Date(),
  noOfOccurances: 0,
  day: 0,
  filterStartDate: new Date(),
  filterEndDate: new Date(),
  setDay: (day) => set(state => ({...state, day})),
  setStartDate: (startDate) => set(state => ({...state, startDate})),
  setNoOfOccurances: (noOfOccurances) => set(state => ({...state, noOfOccurances})),
  setFilterStartDate: (filterStartDate) => set(state => ({...state, filterStartDate})),
  setFilterEndDate: (filterEndDate) => set(state => ({...state, filterEndDate})),
}))