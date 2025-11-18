export function formatAndValidateNumberInput(value: string, onChange: (value: string) => void) {
  const raw = value.replace(/\s/g, "").replace(/,/g, "").replace(/\./g, "");
  if (/^\d*$/.test(raw)) {
    onChange(raw); // Met à jour la valeur brute si elle est valide
  }
}

export const formatCurrency = (amount: number|string, locale: string = 'fr-FR', currency: string = 'XOF'): string => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat(locale, {style: 'currency', currency, maximumFractionDigits: 0}).format(amount);
}

export const formatPhoneInternational = (raw: string, defaultCountryCode = "+225") => {
  if (!raw) return "";
  let input = raw.trim();
  if (!input.startsWith("+")) {
    // retirer les zéros initiaux
    const digits = input.replace(/\D/g, "").replace(/^0+/, "");
    input = defaultCountryCode + digits;
  }
  // E.164 sans espaces
  const e164 = "+" + input.replace(/^\+/, "").replace(/\D/g, "");
  // Ajout d'espaces après l'indicatif puis tous les 2 chiffres
  const ccMatch = e164.match(/^\+\d{1,3}/);
  if (!ccMatch) return e164;
  const cc = ccMatch[0];
  const rest = e164.slice(cc.length).match(/.{1,2}/g)?.join(" ") ?? "";
  return `${cc} ${rest}`.trim();
};
