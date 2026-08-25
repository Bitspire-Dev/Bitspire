export function formatLongDate(date: string, locale: string): string | null {
  if (!date) return null;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date));
  } catch {
    return date;
  }
}

/**
 * Convert a Polish dotted date (`DD.MM.YYYY`) to an ISO 8601 date string
 * (`YYYY-MM-DD`) or `null` when the input is empty/unparseable.
 */
export function dottedDateToIso(date: string | undefined | null): string | null {
  if (!date) return null;
  const match = date.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
