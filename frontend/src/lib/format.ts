export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

export function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * The backend serializes naive UTC timestamps (no "Z"/offset suffix), e.g.
 * "2026-08-24T14:16:41". `new Date(...)` on a string with no timezone is
 * interpreted as LOCAL time by JS, not UTC — in a UTC+5:30 timezone that
 * silently shifts every timestamp by 5.5 hours, which is what was making
 * "time ago" values (and any raw new Date(x.created_at) call) wrong. This
 * normalizes to UTC before parsing; use it anywhere a date string from the
 * API is turned into a Date.
 */
export function parseApiDate(value: string): Date {
  const hasTimezone = /[Zz]|[+-]\d{2}:?\d{2}$/.test(value);
  return new Date(hasTimezone ? value : `${value}Z`);
}

export function formatRelativeTime(iso: string) {
  const diffMs = Math.max(0, Date.now() - parseApiDate(iso).getTime());
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
