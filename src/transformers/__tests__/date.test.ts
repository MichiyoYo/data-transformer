import {
  formatDate,
  formatUSDate,
  formatEUDate,
  toUnixTimestamp,
  toUnixTimestampSeconds,
  fromUnixTimestamp,
  fromUnixTimestampSeconds,
  addDays,
  subtractDays,
  toUtc,
  fromUtc,
  getUserTimezone,
  formatDateLocal,
  formatTimestampLocal,
  formatDateHuman,
  formatDateHumanFull,
  formatRelative,
  formatTimestampRelative,
  isValidDate,
  formatDateSmart,
  isoDateToLocal,
} from '../date';

describe('Date Transformers', () => {
  const testDate = new Date('2023-12-25T10:30:00Z');
  const testTimestamp = testDate.getTime(); // This ensures they match exactly
  const testTimestampSeconds = Math.floor(testTimestamp / 1000); // Convert to seconds

  describe('isoDateToLocal', () => {
    it('should convert ISO date string to Date object', () => {
      const isoString = '2023-12-25T10:30:00Z';
      const result = isoDateToLocal(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(11); // December is month 11
      expect(result.getDate()).toBe(25);
    });

    it('should handle different ISO formats', () => {
      const result = isoDateToLocal('2023-01-15T08:30:00.000Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2023);
    });
  });

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const formatter = formatDate();
      expect(formatter(testDate)).toBe('12/25/2023');
    });

    it('should format date with custom format', () => {
      const formatter = formatDate('yyyy-MM-dd');
      expect(formatter(testDate)).toBe('2023-12-25');
    });

    it('should format date with timezone', () => {
      const formatter = formatDate('MM/dd/yyyy HH:mm', 'America/New_York');
      const result = formatter(testDate);
      expect(result).toMatch(/12\/25\/2023 \d{2}:\d{2}/);
    });
  });

  describe('formatUSDate', () => {
    it('should format in US format with default timezone', () => {
      const formatter = formatUSDate();
      expect(formatter(testDate)).toBe('12/25/2023');
    });

    it('should format in US format with custom timezone', () => {
      const formatter = formatUSDate('America/Los_Angeles');
      expect(formatter(testDate)).toBe('12/25/2023');
    });
  });

  describe('formatEUDate', () => {
    it('should format in EU format with default timezone', () => {
      const formatter = formatEUDate();
      expect(formatter(testDate)).toBe('25.12.2023');
    });

    it('should format in EU format with custom timezone', () => {
      const formatter = formatEUDate('Europe/London');
      expect(formatter(testDate)).toBe('25.12.2023');
    });
  });

  describe('timestamp conversions', () => {
    it('should convert Date to unix timestamp (milliseconds)', () => {
      expect(toUnixTimestamp(testDate)).toBe(testTimestamp);
    });

    it('should convert Date to unix timestamp (seconds)', () => {
      expect(toUnixTimestampSeconds(testDate)).toBe(testTimestampSeconds);
    });

    it('should convert unix timestamp (milliseconds) to Date', () => {
      const result = fromUnixTimestamp(testTimestamp);
      expect(result.getTime()).toBe(testDate.getTime());
    });

    it('should convert unix timestamp (seconds) to Date', () => {
      const result = fromUnixTimestampSeconds(testTimestampSeconds);
      expect(result.getTime()).toBe(testDate.getTime());
    });
  });

  describe('date arithmetic', () => {
    it('should add specified days to date', () => {
      const addFiveDays = addDays(5);
      const result = addFiveDays(testDate);
      const expected = new Date('2023-12-30T10:30:00Z');
      expect(result.getTime()).toBe(expected.getTime());
    });

    it('should subtract specified days from date', () => {
      const subtractThreeDays = subtractDays(3);
      const result = subtractThreeDays(testDate);
      const expected = new Date('2023-12-22T10:30:00Z');
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('timezone conversions', () => {
    it('should convert date from timezone to UTC', () => {
      const converter = toUtc('America/New_York');
      const result = converter(testDate);
      expect(result).toBeInstanceOf(Date);
    });

    it('should convert UTC date to timezone', () => {
      const converter = fromUtc('America/New_York');
      const result = converter(testDate);
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('getUserTimezone', () => {
    it('should return a valid timezone string', () => {
      const timezone = getUserTimezone();
      expect(typeof timezone).toBe('string');
      expect(timezone.length).toBeGreaterThan(0);
    });
  });

  describe('formatDateLocal', () => {
    it('should format date in local timezone with default format', () => {
      const formatter = formatDateLocal();
      const result = formatter(testDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format date in local timezone with custom format', () => {
      const formatter = formatDateLocal('yyyy-MM-dd');
      const result = formatter(testDate);
      expect(result).toBe('2023-12-25');
    });
  });

  describe('formatTimestampLocal', () => {
    it('should format timestamp in local timezone (milliseconds)', () => {
      const formatter = formatTimestampLocal();
      const result = formatter(testTimestamp);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2} (AM|PM)/);
    });

    it('should format timestamp in local timezone (seconds)', () => {
      const formatter = formatTimestampLocal(undefined, true);
      const result = formatter(testTimestampSeconds);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2} (AM|PM)/);
    });
  });

  describe('formatDateHuman', () => {
    it('should format date in human-readable format with timezone abbreviation', () => {
      const formatter = formatDateHuman('America/New_York');
      const result = formatter(testDate);
      expect(result).toMatch(
        /December 25, 2023 \d{1,2}:\d{2} (AM|PM) [A-Z]{3}/
      );
    });
  });

  describe('formatDateHumanFull', () => {
    it('should format date in human-readable format with full timezone name', () => {
      const formatter = formatDateHumanFull('America/New_York');
      const result = formatter(testDate);
      expect(result).toMatch(/December 25, 2023 \d{1,2}:\d{2} (AM|PM) .+ Time/);
    });
  });

  describe('formatRelative', () => {
    it('should format recent date as relative time', () => {
      const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const formatter = formatRelative();
      const result = formatter(recentDate);
      expect(result).toMatch(/ago/);
    });

    it('should format future date as relative time', () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
      const formatter = formatRelative();
      const result = formatter(futureDate);
      expect(result).toMatch(/in/);
    });
  });

  describe('formatTimestampRelative', () => {
    it('should format recent timestamp as relative time (milliseconds)', () => {
      const recentTimestamp = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
      const formatter = formatTimestampRelative();
      const result = formatter(recentTimestamp);
      expect(result).toMatch(/ago/);
    });

    it('should format recent timestamp as relative time (seconds)', () => {
      const recentTimestamp = Math.floor(Date.now() / 1000) - 2 * 60 * 60; // 2 hours ago in seconds
      const formatter = formatTimestampRelative(true);
      const result = formatter(recentTimestamp);
      expect(result).toMatch(/ago/);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(testDate)).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('formatDateSmart', () => {
    it('should use relative format for recent dates', () => {
      const recentDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      const formatter = formatDateSmart();
      const result = formatter(recentDate);
      expect(result).toMatch(/ago/);
    });

    it('should use full format for old dates', () => {
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      const formatter = formatDateSmart();
      const result = formatter(oldDate);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM) [A-Z]{3}/);
    });

    it('should respect custom cutoff days', () => {
      const recentDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      const formatter = formatDateSmart(3); // 3-day cutoff
      const result = formatter(recentDate);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM) [A-Z]{3}/); // Should use full format
    });
  });
});
