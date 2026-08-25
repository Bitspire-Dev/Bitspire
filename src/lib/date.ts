export function formatLongDate(date: string, locale: string): string | null {
  if (!date) return null;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date));
  } catch {
    return date;
  }
}
