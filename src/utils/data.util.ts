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