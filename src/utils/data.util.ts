export function minutes(minutes: number): number {
  return minutes * 60;
}

export function hours(hours: number): number {
  return hours * 60 * 60;
};

export function days(days: number): number {
  return days * (60 * 60 * 24);
};

export function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function formatLastSeen(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const timezoneOffset = now.getTimezoneOffset() * 60000; // Смещение часового пояса в миллисекундах
  const diffMs = now.getTime() - (past.getTime() - timezoneOffset);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMin < 1) return "Был в сети только что";
  if (diffMin < 60) return `Был в сети ${diffMin}мин. назад`;
  if (diffHrs < 24) return `Был в сети ${diffHrs}ч. назад`;
  if (diffDays < 30) return `Был в сети ${diffDays}д. назад`;
  if (diffMonths < 12) return `Был в сети ${diffMonths} месяц${diffMonths === 1 ? '' : 'а'} назад`;
  return `Был в сети ${diffYears} год${diffYears % 10 === 1 && diffYears !== 11 ? '' : (diffYears % 10 >= 2 && diffYears % 10 <= 4 && (diffYears < 10 || diffYears > 20)) ? 'а' : 'ов'} назад`;
}