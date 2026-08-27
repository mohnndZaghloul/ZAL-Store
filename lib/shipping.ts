export const GOVERNORATES = [
  { value: "Cairo", label: "Cairo", fee: 50 },
  { value: "Giza", label: "Giza", fee: 50 },
  { value: "Qalyubia", label: "Qalyubia", fee: 50 },
  { value: "Alexandria", label: "Alexandria", fee: 60 },
  { value: "Port Said", label: "Port Said", fee: 60 },
  { value: "Suez", label: "Suez", fee: 60 },
  { value: "Dakahlia", label: "Dakahlia", fee: 60 },
  { value: "Sharqia", label: "Sharqia", fee: 60 },
  { value: "Gharbia", label: "Gharbia", fee: 60 },
  { value: "Monufia", label: "Monufia", fee: 60 },
  { value: "Beheira", label: "Beheira", fee: 60 },
  { value: "Ismailia", label: "Ismailia", fee: 60 },
  { value: "Kafr El Sheikh", label: "Kafr El Sheikh", fee: 60 },
  { value: "Damietta", label: "Damietta", fee: 60 },
  { value: "Faiyum", label: "Faiyum", fee: 60 },
  { value: "Beni Suef", label: "Beni Suef", fee: 60 },
  { value: "Minya", label: "Minya", fee: 80 },
  { value: "Asyut", label: "Asyut", fee: 80 },
  { value: "Sohag", label: "Sohag", fee: 80 },
  { value: "Qena", label: "Qena", fee: 80 },
  { value: "Aswan", label: "Aswan", fee: 80 },
  { value: "Luxor", label: "Luxor", fee: 80 },
  { value: "Red Sea", label: "Red Sea", fee: 100 },
  { value: "New Valley", label: "New Valley", fee: 100 },
  { value: "Matrouh", label: "Matrouh", fee: 100 },
  { value: "North Sinai", label: "North Sinai", fee: 100 },
  { value: "South Sinai", label: "South Sinai", fee: 100 },
] as const;

export type GovernorateValue = (typeof GOVERNORATES)[number]["value"];

export const GOVERNORATE_VALUES = GOVERNORATES.map((g) => g.value) as [
  GovernorateValue,
  ...GovernorateValue[],
];

export function getShippingFee(governorate: string): number {
  return GOVERNORATES.find((g) => g.value === governorate)?.fee ?? 0;
}
