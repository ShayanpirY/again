const COLOR_NAMES: Record<string, string> = {
  '#000000': 'مشکی',
  '#FFFFFF': 'سفید',
  '#FF0000': 'قرمز',
  '#0000FF': 'آبی',
  '#008000': 'سبز',
  '#FFFF00': 'زرد',
  '#FFA500': 'نارنجی',
  '#800080': 'بنفش',
  '#FFC0CB': 'صورتی',
  '#A52A2A': 'قهوه‌ای',
  '#808080': 'خاکستری',
  '#E6E6FA': 'یاسی',
  '#F5F5DC': 'کرم / بژ',
  '#40E0D0': 'فیروزه‌ای',
  '#000080': 'سورمه‌ای',
  '#800000': 'زرشکی',
  '#98FF98': 'نعنایی',
  '#FFD700': 'طلایی/خردلی',
};

export const getColorName = (colorHex: string): string => {
  if (!colorHex) return '';
  const normalizedHex = colorHex.toUpperCase().trim();
  return COLOR_NAMES[normalizedHex] || COLOR_NAMES[colorHex.toLowerCase().trim()] || colorHex;
};
