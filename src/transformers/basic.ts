import { Transformer } from '../types';

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The input string to capitalize
 * @returns The string with the first letter capitalized
 *
 * @example
 * ```typescript
 * capitalize('hello world') // returns 'Hello world'
 * ```
 */
export const capitalize: Transformer<string, string> = (
  str: string
): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts an ISO date string to a JavaScript Date object.
 *
 * @param isoString - The ISO 8601 date string
 * @returns A JavaScript Date object
 *
 * @example
 * ```typescript
 * isoDateToLocal('2023-12-25T10:30:00Z') // returns Date object
 * ```
 */
export const isoDateToLocal: Transformer<string, Date> = (
  isoString: string
): Date => new Date(isoString);

/**
 * Creates a transformer that applies a given transformer to each item in an array.
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
  return (items: TInput[]): TOutput[] => items.map(itemTransformer);
};

/**
 * Creates a transformer that applies a transformation to a specific field in an object.
 *
 * @param fieldName - The name of the field to transform
 * @param fieldTransformer - The transformer to apply to the field
 * @returns A transformer that works on objects
 *
 * @example
 * ```typescript
 * const transformCreatedAt = transformField('createdAt', isoDateToLocal);
 * transformCreatedAt({id: 1, createdAt: '2023-01-01T00:00:00Z'})
 * ```
 */
export const transformField = <TObject, TKey extends keyof TObject, TOutput>(
  fieldName: TKey,
  fieldTransformer: Transformer<TObject[TKey], TOutput>
): Transformer<TObject, TObject & { [K in TKey]: TOutput }> => {
  return (obj: TObject) => ({
    ...obj,
    [fieldName]: fieldTransformer(obj[fieldName]),
  });
};
