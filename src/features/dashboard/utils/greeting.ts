/**
 * @file        greeting.ts
 * @feature     Dashboard
 * @description Time-of-day greeting helper for personalized dashboard headers.
 * @author      MiStarStudio
 */

/** Returns "Good morning", "Good afternoon", or "Good evening" based on local hour. */
export function getTimeGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
