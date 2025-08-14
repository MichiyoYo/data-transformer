import { Transformer } from '@/types';
import _ from 'lodash';

/**
 * Creates a transformer that applies a given transformer to each item in an array.
 * Uses Lodash's map for consistent behavior and performance.
 *
 * @param itemTransformer - The transformer to apply to each array item
 * @returns A transformer that works on arrays
 *
 * @example
 * ```typescript
 * const capitalizeAll = mapItems(capitalize);
 * capitalizeAll(['hello', 'world']) // returns ['Hello', 'World']
 * ```
 */
export const mapItems = <TInput, TOutput>(
  itemTransformer: Transformer<TInput, TOutput>
): Transformer<TInput[], TOutput[]> => {
  return (items: TInput[]): TOutput[] => _.map(items, itemTransformer);
};

/**
 * Creates a transformer that filters array items based on a predicate.
 * Uses Lodash's filter for consistent behavior.
 *
 * @param predicate - Function to test each item
 * @returns A transformer that filters arrays
 */
export const filterItems = <T>(
  predicate: (item: T) => boolean
): Transformer<T[], T[]> => {
  return (items: T[]): T[] => _.filter(items, predicate);
};

/**
 * Creates a transformer that sorts array items.
 * Uses Lodash's sortBy for robust sorting.
 *
 * @param iteratee - Function to determine sort value
 * @param ascending - Sort direction (default: true)
 */
export const sortItems = <T>(
  iteratee: (item: T) => any,
  ascending: boolean = true
): Transformer<T[], T[]> => {
  return (items: T[]): T[] => {
    const sorted = _.sortBy(items, iteratee);
    return ascending ? sorted : sorted.reverse();
  };
};

/**
 * Creates a transformer that groups array items by a key.
 * Uses Lodash's groupBy for efficient grouping.
 */
export const groupBy = <T>(
  iteratee: (item: T) => string | number
): Transformer<T[], Record<string, T[]>> => {
  return (items: T[]): Record<string, T[]> => _.groupBy(items, iteratee);
};

/**
 * Creates a transformer that removes duplicates by a key.
 * Uses Lodash's uniqBy for efficient deduplication.
 */
export const uniqueBy = <T>(
  iteratee: (item: T) => any
): Transformer<T[], T[]> => {
  return (items: T[]): T[] => _.uniqBy(items, iteratee);
};

/**
 * Creates a transformer that finds the first item matching a predicate.
 * Uses Lodash's find for consistent behavior.
 */
export const findItem = <T>(
  predicate: (item: T) => boolean
): Transformer<T[], T | undefined> => {
  return (items: T[]): T | undefined => _.find(items, predicate);
};

/**
 * Creates a transformer that reduces an array to a single value.
 * Uses Lodash's reduce for consistent behavior.
 */
export const reduceItems = <T, TResult>(
  iteratee: (accumulator: TResult, item: T) => TResult,
  initialValue: TResult
): Transformer<T[], TResult> => {
  return (items: T[]): TResult => _.reduce(items, iteratee, initialValue);
};
