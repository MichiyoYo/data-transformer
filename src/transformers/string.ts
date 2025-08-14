import { Transformer } from '@/types';
import _ from 'lodash';

/**
 * Removes leading and trailing whitespace from a string.
 * Uses Lodash's trim implementation.
 */
export const trim: Transformer<string, string> = _.trim;

/**
 * Converts string to uppercase.
 * Uses Lodash's toUpper implementation.
 */
export const toUpperCase: Transformer<string, string> = _.toUpper;

/**
 * Converts string to lowercase.
 * Uses Lodash's toLower implementation.
 */
export const toLowerCase: Transformer<string, string> = _.toLower;

/**
 * Converts text to a URL-friendly slug.
 * Removes special characters and converts to kebab-case.
 *
 * @example
 * ```typescript
 * slugify('Hello World!') // returns 'hello-world'
 * ```
 */
export const slugify: Transformer<string, string> = (str: string): string => {
  const cleaned = str.replace(/[^\w\s-]/g, '');
  return _.kebabCase(cleaned);
};

/**
 * Creates a transformer that truncates strings to a specified length with ellipsis.
 *
 * @param maxLength - Maximum length before truncation
 * @returns A transformer that truncates strings
 *
 * @example
 * ```typescript
 * const truncate10 = truncate(10);
 * truncate10('Very long text') // returns 'Very lon...'
 * ```
 */
export const truncate = (maxLength: number): Transformer<string, string> => {
  return (str: string): string => _.truncate(str, { length: maxLength });
};
