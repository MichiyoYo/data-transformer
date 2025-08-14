import { Transformer } from '@/types';
import {
  format,
  addDays as fnsAddDays,
  subDays as fnsSubDays,
  getUnixTime,
  fromUnixTime,
  formatDistanceToNow,
  isValid,
} from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

/**
 * Creates a transformer that formats dates with optional timezone support.
 *
 * @param formatString - Date format string (default: 'MM/dd/yyyy')
 * @param timeZone - Optional timezone (e.g., 'America/New_York', 'Europe/Berlin')
 * @returns A transformer that formats Date objects
 *
 * @example
 * ```typescript
 * const formatUS = formatDate('MM/dd/yyyy');
 * const formatEU = formatDate('dd.MM.yyyy', 'Europe/Berlin');
 * formatUS(new Date()) // '12/25/2023'
 * formatEU(new Date()) // '25.12.2023' (in Berlin timezone)
 * ```
 */
export const formatDate = (
  formatString?: string,
  timeZone?: string
): Transformer<Date, string> => {
  return (date: Date): string => {
    const fmt = formatString || 'MM/dd/yyyy';
    if (timeZone) {
      return formatInTimeZone(date, timeZone, fmt);
    }
    return format(date, fmt);
  };
};

/**
 * Creates a transformer for US date format (MM/dd/yyyy).
 *
 * @param timeZone - Optional US timezone (default: 'America/New_York')
 */
export const formatUSDate = (timeZone?: string): Transformer<Date, string> => {
  return formatDate('MM/dd/yyyy', timeZone || 'America/New_York');
};

/**
 * Creates a transformer for European date format (dd.MM.yyyy).
 *
 * @param timeZone - Optional European timezone (default: 'Europe/Berlin')
 */
export const formatEUDate = (timeZone?: string): Transformer<Date, string> => {
  return formatDate('dd.MM.yyyy', timeZone || 'Europe/Berlin');
};

/**
 * Converts Date to Unix timestamp (milliseconds).
 */
export const toUnixTimestamp: Transformer<Date, number> = (
  date: Date
): number => {
  return date.getTime();
};

/**
 * Converts Date to Unix timestamp (seconds).
 */
export const toUnixTimestampSeconds: Transformer<Date, number> = (
  date: Date
): number => {
  return getUnixTime(date);
};

/**
 * Converts Unix timestamp (milliseconds) to Date.
 */
export const fromUnixTimestamp: Transformer<number, Date> = (
  timestamp: number
): Date => {
  return new Date(timestamp);
};

/**
 * Converts Unix timestamp (seconds) to Date.
 */
export const fromUnixTimestampSeconds: Transformer<number, Date> = (
  timestamp: number
): Date => {
  return fromUnixTime(timestamp);
};

/**
 * Creates a transformer that adds specified days to a date.
 *
 * @param days - Number of days to add
 */
export const addDays = (days: number): Transformer<Date, Date> => {
  return (date: Date): Date => fnsAddDays(date, days);
};

/**
 * Creates a transformer that subtracts specified days from a date.
 *
 * @param days - Number of days to subtract
 */
export const subtractDays = (days: number): Transformer<Date, Date> => {
  return (date: Date): Date => fnsSubDays(date, days);
};

/**
 * Converts a date from one timezone to UTC.
 *
 * @param timeZone - Source timezone
 */
export const toUtc = (timeZone: string): Transformer<Date, Date> => {
  return (date: Date): Date => fromZonedTime(date, timeZone);
};

/**
 * Converts a UTC date to a specific timezone.
 *
 * @param timeZone - Target timezone
 */
export const fromUtc = (timeZone: string): Transformer<Date, Date> => {
  return (date: Date): Date => toZonedTime(date, timeZone);
};

/**
 * Gets the user's current timezone automatically.
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Creates a transformer that formats dates in the user's local timezone.
 *
 * @param formatString - Date format string (default: 'MM/dd/yyyy')
 * @returns A transformer that formats dates in user's timezone
 */
export const formatDateLocal = (
  formatString?: string
): Transformer<Date, string> => {
  return formatDate(formatString || 'MM/dd/yyyy', getUserTimezone());
};

/**
 * Creates a transformer that formats timestamps to user's local timezone.
 *
 * @param formatString - Date format string (default: 'MM/dd/yyyy h:mm a')
 * @param isSeconds - Whether timestamp is in seconds (default: false, assumes milliseconds)
 */
export const formatTimestampLocal = (
  formatString?: string,
  isSeconds?: boolean
): Transformer<number, string> => {
  return (timestamp: number): string => {
    const fmt = formatString || 'MM/dd/yyyy h:mm a';
    const seconds = isSeconds || false;
    const date = seconds ? fromUnixTime(timestamp) : new Date(timestamp);
    return formatInTimeZone(date, getUserTimezone(), fmt);
  };
};

/**
 * Creates a transformer for human-readable date with timezone abbreviation.
 * Format: "April 14, 1988 10:00 AM PST"
 *
 * @param timeZone - Target timezone (default: user's timezone)
 */
export const formatDateHuman = (
  timeZone?: string
): Transformer<Date, string> => {
  const tz = timeZone || getUserTimezone();

  return (date: Date): string => {
    // Format the date part
    const dateStr = formatInTimeZone(date, tz, 'MMMM d, yyyy h:mm a');

    // Get timezone abbreviation
    const tzAbbr = formatInTimeZone(date, tz, 'zzz');

    return `${dateStr} ${tzAbbr}`;
  };
};

/**
 * Creates a transformer for human-readable date with full timezone name.
 * Format: "April 14, 1988 10:00 AM Pacific Standard Time"
 */
export const formatDateHumanFull = (
  timeZone?: string
): Transformer<Date, string> => {
  const tz = timeZone || getUserTimezone();

  return (date: Date): string => {
    // Format the date part
    const dateStr = formatInTimeZone(date, tz, 'MMMM d, yyyy h:mm a');

    // Get full timezone name
    const tzFull = formatInTimeZone(date, tz, 'zzzz');

    return `${dateStr} ${tzFull}`;
  };
};

/**
 * Creates a transformer for relative time formatting.
 * Format: "2 hours ago", "in 3 days", etc.
 *
 * @param options - Options for formatDistanceToNow
 */
export const formatRelative = (options?: {
  addSuffix?: boolean;
  includeSeconds?: boolean;
}): Transformer<Date, string> => {
  return (date: Date): string => {
    return formatDistanceToNow(date, { addSuffix: true, ...options });
  };
};

/**
 * Creates a transformer that converts timestamp to relative time in user's timezone.
 *
 * @param isSeconds - Whether timestamp is in seconds (default: false)
 */
export const formatTimestampRelative = (
  isSeconds?: boolean
): Transformer<number, string> => {
  return (timestamp: number): string => {
    const seconds = isSeconds || false;
    const date = seconds ? fromUnixTime(timestamp) : new Date(timestamp);
    return formatRelative()(date);
  };
};

/**
 * Validates if a date is valid.
 */
export const isValidDate: Transformer<Date, boolean> = isValid;

/**
 * Creates a smart date formatter that chooses format based on how recent the date is.
 * Recent dates show relative time, older dates show full format.
 *
 * @param cutoffDays - Days after which to show full date instead of relative (default: 7)
 * @param timeZone - Target timezone (default: user's timezone)
 */
export const formatDateSmart = (
  cutoffDays?: number,
  timeZone?: string
): Transformer<Date, string> => {
  const cutoff = cutoffDays || 7;
  const tz = timeZone || getUserTimezone();

  return (date: Date): string => {
    const now = new Date();
    const diffInDays = Math.abs(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= cutoff) {
      return formatRelative()(date);
    } else {
      return formatDateHuman(tz)(date);
    }
  };
};
