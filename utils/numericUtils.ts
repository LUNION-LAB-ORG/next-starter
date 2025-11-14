export function formatAndValidateNumberInput(value: string, onChange: (value: string) => void) {
  const raw = value.replace(/\s/g, "").replace(/,/g, "").replace(/\./g, "");
  if (/^\d*$/.test(raw)) {
    onChange(raw); // Met à jour la valeur brute si elle est valide
  }
}