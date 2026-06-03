export function isBlogPostPublished(dateValue: string, now = new Date()): boolean {
  const publishedAt = new Date(dateValue);

  if (Number.isNaN(publishedAt.getTime())) {
    return false;
  }

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  return publishedAt.getTime() <= endOfToday.getTime();
}
