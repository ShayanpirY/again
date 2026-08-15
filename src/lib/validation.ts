const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toEnDigits(value: string): string {
  return value
    .replace(/\s|[-—–]/g, "")
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

export function normalizeIranPhone(value: string): string {
  const digits = toEnDigits(value).replace(/^\+/, "");
  if (/^98\d{10}$/.test(digits)) return `0${digits.slice(2)}`;
  if (/^9\d{9}$/.test(digits)) return `0${digits}`;
  return digits;
}

export function isValidIranPhone(value: string): boolean {
  return /^09\d{9}$/.test(normalizeIranPhone(value));
}
