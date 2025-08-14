import { Transformer } from '@/types';
import _ from 'lodash';

/**
 * Creates a transformer that formats a number to a fixed number of decimal places.
 * Uses Lodash's round for consistent rounding behavior.
 */
export const toFixed = (decimalPlaces: number): Transformer<number, string> => {
  return (num: number): string => {
    const rounded = _.round(num, decimalPlaces);
    return rounded.toFixed(decimalPlaces);
  };
};

/**
 * Parses a string and returns an integer using lenient parsing.
 * Parses until it hits non-numeric characters (like native parseInt).
 *
 * @example
 * ```typescript
 * parseInt('123abc') // returns 123
 * parseInt('abc') // returns NaN
 * ```
 */
export const parseInt: Transformer<string, number> = (str: string): number => {
  return Number.parseInt(str, 10);
};

/**
 * Parses a string and returns an integer using strict parsing.
 * Only converts if the entire string represents a valid number.
 *
 * @example
 * ```typescript
 * toInteger('123') // returns 123
 * toInteger('123abc') // returns 0
 * ```
 */
export const toInteger: Transformer<string, number> = _.toInteger;
/**
 * Parses a string and returns a floating point number.
 * Uses Lodash's toNumber for better handling of edge cases.
 */
export const parseFloat: Transformer<string, number> = _.toNumber;

/**
 * Creates a transformer that formats a number as currency.
 * Uses Lodash's isFinite for validation.
 */
export const formatCurrency = (
  currency: string = 'USD'
): Transformer<number, string> => {
  return (num: number): string => {
    if (!_.isFinite(num)) {
      return 'Invalid';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };
};

/**
 * Creates a transformer that formats a decimal as a percentage.
 * Uses Lodash's round for consistent rounding.
 */
export const formatPercentage = (
  decimalPlaces: number
): Transformer<number, string> => {
  return (num: number): string => {
    if (!_.isFinite(num)) {
      return 'Invalid';
    }
    const percentage = _.round(num * 100, decimalPlaces);
    return `${percentage.toFixed(decimalPlaces)}%`;
  };
};
