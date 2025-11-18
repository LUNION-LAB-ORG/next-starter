export function formatAndValidateNumberInput(
  value: string,
  onChange: (value: string) => void,
) {
  const raw = value.replace(/\s/g, "").replace(/,/g, "").replace(/\./g, "");
  if (/^\d*$/.test(raw)) {
    onChange(raw); // Met à jour la valeur brute si elle est valide
  }
}

export const formatCurrency = (
  amount: number | string,
  locale: string = "fr-FR",
  currency: string = "XOF",
): string => {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPhoneForHuman = (
  raw: string,
  defaultCountryCode = "+225",
) => {
  //0586670950 -> +225 05 86 67 09 50
  let phone = raw.replace(/\s+/g, "");

  if (phone.startsWith("0")) {
    phone = defaultCountryCode + phone.slice(0);
  } else if (!phone.startsWith("+")) {
    phone = defaultCountryCode + phone;
  }

  return phone.replace(
    /(\+\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/,
    "$1 $2 $3 $4 $5",
  );
};
