export type PeriodMunute = { value: string; label: string; available: boolean };

export type PeriodHour = {
  value: string;
  label: string;
  available: boolean;
  minutes: PeriodMunute[];
};

const generateAllMinutes = (): PeriodMunute[] => {
  const minutes: PeriodMunute[] = [];
  for (let i = 0; i < 60; i++) {
    const value = i.toString().padStart(2, "0");
    minutes.push({ value, label: value, available: true });
  }
  return minutes;
};

const ALL_MINUTES = generateAllMinutes();

export const InitialTimeHours: PeriodHour[] = [
  { value: "0", label: "00", available: true, minutes: ALL_MINUTES },
  { value: "1", label: "01", available: true, minutes: ALL_MINUTES },
  { value: "2", label: "02", available: true, minutes: ALL_MINUTES },
  { value: "3", label: "03", available: true, minutes: ALL_MINUTES },
  { value: "4", label: "04", available: true, minutes: ALL_MINUTES },
  { value: "5", label: "05", available: true, minutes: ALL_MINUTES },
  { value: "6", label: "06", available: true, minutes: ALL_MINUTES },
  { value: "7", label: "07", available: true, minutes: ALL_MINUTES },
  { value: "8", label: "08", available: true, minutes: ALL_MINUTES },
  { value: "9", label: "09", available: true, minutes: ALL_MINUTES },
  { value: "10", label: "10", available: true, minutes: ALL_MINUTES },
  { value: "11", label: "11", available: true, minutes: ALL_MINUTES },
  { value: "12", label: "12", available: true, minutes: ALL_MINUTES },
  { value: "13", label: "13", available: true, minutes: ALL_MINUTES },
  { value: "14", label: "14", available: true, minutes: ALL_MINUTES },
  { value: "15", label: "15", available: true, minutes: ALL_MINUTES },
  { value: "16", label: "16", available: true, minutes: ALL_MINUTES },
  { value: "17", label: "17", available: true, minutes: ALL_MINUTES },
  { value: "18", label: "18", available: true, minutes: ALL_MINUTES },
  { value: "19", label: "19", available: true, minutes: ALL_MINUTES },
  { value: "20", label: "20", available: true, minutes: ALL_MINUTES },
  { value: "21", label: "21", available: true, minutes: ALL_MINUTES },
  { value: "22", label: "22", available: true, minutes: ALL_MINUTES },
  { value: "23", label: "23", available: true, minutes: ALL_MINUTES },
  { value: "24", label: "24", available: true, minutes: ALL_MINUTES },
];
