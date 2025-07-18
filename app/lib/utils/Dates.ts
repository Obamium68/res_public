export function formatDateTime(date: Date | string): string {
  const d = new Date(date);

  return new Intl.DateTimeFormat("it-IT", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
