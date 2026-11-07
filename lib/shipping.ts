export const GOVERNORATES = [
  { value: "Cairo", label: "Cairo", fee: 95 },
  { value: "Giza", label: "Giza", fee: 95 },
  { value: "Qalyubia", label: "Qalyubia", fee: 105 },
  { value: "Alexandria", label: "Alexandria", fee: 95 },
  { value: "Port Said", label: "Port Said", fee: 105 },
  { value: "Suez", label: "Suez", fee: 105 },
  { value: "Dakahlia", label: "Dakahlia", fee: 105 },
  { value: "Sharqia", label: "Sharqia", fee: 105 },
  { value: "Gharbia", label: "Gharbia", fee: 105 },
  { value: "Monufia", label: "Monufia", fee: 105 },
  { value: "Beheira", label: "Beheira", fee: 105 },
  { value: "Ismailia", label: "Ismailia", fee: 105 },
  { value: "Kafr El Sheikh", label: "Kafr El Sheikh", fee: 105 },
  { value: "Damietta", label: "Damietta", fee: 105 },
  { value: "Faiyum", label: "Faiyum", fee: 105 },
  { value: "Beni Suef", label: "Beni Suef", fee: 125 },
  { value: "Minya", label: "Minya", fee: 125 },
  { value: "Asyut", label: "Asyut", fee: 125 },
  { value: "Sohag", label: "Sohag", fee: 125 },
  { value: "Qena", label: "Qena", fee: 125 },
  { value: "Aswan", label: "Aswan", fee: 125 },
  { value: "Luxor", label: "Luxor", fee: 125 },
  { value: "Red Sea", label: "Red Sea", fee: 125 },
  { value: "New Valley", label: "New Valley", fee: 105 },
  { value: "Matrouh", label: "Matrouh", fee: 140 },
  { value: "North Sinai", label: "North Sinai", fee: 140 },
  { value: "South Sinai", label: "South Sinai", fee: 140 },
] as const;

export type GovernorateValue = (typeof GOVERNORATES)[number]["value"];

export const GOVERNORATE_VALUES = GOVERNORATES.map((g) => g.value) as [
  GovernorateValue,
  ...GovernorateValue[],
];

export function getShippingFee(governorate: string): number {
  return GOVERNORATES.find((g) => g.value === governorate)?.fee ?? 0;
}
