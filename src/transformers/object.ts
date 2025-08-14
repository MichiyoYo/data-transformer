import { Transformer } from '@/types';
import _ from 'lodash';

/**
 * Creates a transformer that applies a transformation to a specific field in an object.
 * Uses Lodash's set and get for safe object manipulation.
 *
 * @param fieldName - The name of the field to transform
 * @param fieldTransformer - The transformer to apply to the field
 * @returns A transformer that works on objects
 *
 * @example
 * ```typescript
 * const transformCreatedAt = transformField('createdAt', isoDateToLocal);
 * transformCreatedAt({id: 1, createdAt: '2023-01-01T00:00:00Z'})
 * // returns {id: 1, createdAt: Date object}
 * ```
 */
export const transformField = <TObject, TKey extends keyof TObject, TOutput>(
  fieldName: TKey,
  fieldTransformer: Transformer<TObject[TKey], TOutput>
): Transformer<TObject, TObject & { [K in TKey]: TOutput }> => {
  return (obj: TObject) => ({
    ...obj,
    [fieldName]: fieldTransformer(_.get(obj, fieldName as string)),
  });
};

/**
 * Creates a transformer that picks specified fields from an object.
 * Uses Lodash's pick for robust object field selection.
 *
 * @param fields - Array of field names to pick
 * @returns A transformer that picks specified fields
 *
 * @example
 * ```typescript
 * const pickBasicInfo = pickFields(['id', 'name', 'email']);
 * pickBasicInfo(user) // { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export const pickFields = <T extends Record<string, any>, K extends keyof T>(
  fields: K[]
): Transformer<T, Pick<T, K>> => {
  return (obj: T): Pick<T, K> => _.pick(obj, fields);
};

/**
 * Creates a transformer that omits specified fields from an object.
 * Uses Lodash's omit for robust object field exclusion.
 *
 * @param fields - Array of field names to omit
 * @returns A transformer that omits specified fields
 *
 * @example
 * ```typescript
 * const removePrivateFields = omitFields(['password', 'ssn']);
 * removePrivateFields(user) // user object without password and ssn fields
 * ```
 */
export const omitFields = <T extends Record<string, any>, K extends keyof T>(
  fields: K[]
): Transformer<T, Omit<T, K>> => {
  return (obj: T): Omit<T, K> => _.omit(obj, fields);
};

/**
 * Creates a transformer that renames object fields.
 * Uses Lodash's mapKeys and get for safe field renaming.
 *
 * @param fieldMap - Object mapping old field names to new field names
 * @returns A transformer that renames fields
 *
 * @example
 * ```typescript
 * const renameApiFields = renameFields({
 *   first_name: 'firstName',
 *   last_name: 'lastName',
 *   created_at: 'createdDate'
 * });
 * ```
 */
export const renameFields = <T extends Record<string, any>>(
  fieldMap: Record<string, string>
): Transformer<T, Record<string, any>> => {
  return (obj: T): Record<string, any> => {
    const result = { ...obj };

    // Process each rename mapping
    Object.entries(fieldMap).forEach(([oldKey, newKey]) => {
      if (_.has(obj, oldKey)) {
        _.set(result, newKey, _.get(obj, oldKey));
        _.unset(result, oldKey);
      }
    });

    return result;
  };
};

/**
 * Creates a transformer that flattens a nested object.
 * Uses Lodash's reduce and merge for safe object flattening.
 *
 * @param separator - String to use as separator for nested keys (default: '.')
 * @returns A transformer that flattens nested objects
 *
 * @example
 * ```typescript
 * const flatten = flattenObject();
 * flatten({ user: { name: 'John', address: { city: 'NYC' } } })
 * // Returns: { 'user.name': 'John', 'user.address.city': 'NYC' }
 * ```
 */
export const flattenObject = (
  separator: string = '.'
): Transformer<Record<string, any>, Record<string, any>> => {
  return (obj: Record<string, any>): Record<string, any> => {
    const flatten = (target: any, prefix: string = ''): Record<string, any> => {
      return _.reduce(
        target,
        (result, value, key) => {
          const newKey = prefix ? `${prefix}${separator}${key}` : key;

          if (_.isPlainObject(value) && !_.isEmpty(value)) {
            _.assign(result, flatten(value, newKey));
          } else {
            result[newKey] = value;
          }

          return result;
        },
        {} as Record<string, any>
      );
    };

    return flatten(obj);
  };
};

/**
 * Creates a transformer that merges multiple objects.
 * Uses Lodash's merge or defaults based on override flag.
 *
 * @param override - If true, source values override target values; if false, target values are preserved (default: false)
 * @param sources - Objects to merge into the target
 * @returns A transformer that merges objects
 *
 * @example
 * ```typescript
 * // Preserve existing values (add defaults)
 * const addDefaults = mergeObjects(false, { isActive: true, role: 'user' });
 * addDefaults({ id: 1, isActive: false }) // { id: 1, isActive: false, role: 'user' }
 *
 * // Override with new values
 * const applyUpdates = mergeObjects(true, { isActive: true, role: 'admin' });
 * applyUpdates({ id: 1, isActive: false }) // { id: 1, isActive: true, role: 'admin' }
 * ```
 */
export const mergeObjects = (
  override: boolean = false,
  ...sources: Record<string, any>[]
): Transformer<Record<string, any>, Record<string, any>> => {
  return (target: Record<string, any>): Record<string, any> => {
    if (override) {
      // Source values override target values
      return _.merge({}, target, ...sources);
    } else {
      // Target values are preserved (defaults behavior)
      return _.defaults({}, target, ...sources);
    }
  };
};

/**
 * Creates a transformer that deeply clones an object.
 * A deep clone is a clone of the original object indipendent from the original.
 * This means that edits to a deep clone won't affect the original object.
 * Uses Lodash's cloneDeep for safe object cloning.
 *
 * @example
 * ```typescript
 * const clonedUser = deepClone(user);
 * ```
 */
export const deepClone: Transformer<any, any> = _.cloneDeep;

/**
 * Creates a transformer that converts object keys to camelCase.
 * Uses Lodash's camelCase for consistent key transformation.
 *
 * @example
 * ```typescript
 * const toCamelCase = keysToCamelCase();
 * toCamelCase({ first_name: 'John', last_name: 'Doe' })
 * // Returns: { firstName: 'John', lastName: 'Doe' }
 * ```
 */
export const keysToCamelCase = (): Transformer<
  Record<string, any>,
  Record<string, any>
> => {
  return (obj: Record<string, any>): Record<string, any> => {
    return _.mapKeys(obj, (value, key) => _.camelCase(key));
  };
};

/**
 * Creates a transformer that converts object keys to snake_case.
 * Uses Lodash's snakeCase for consistent key transformation.
 *
 * @example
 * ```typescript
 * const toSnakeCase = keysToSnakeCase();
 * toSnakeCase({ firstName: 'John', lastName: 'Doe' })
 * // Returns: { first_name: 'John', last_name: 'Doe' }
 * ```
 */
export const keysToSnakeCase = (): Transformer<
  Record<string, any>,
  Record<string, any>
> => {
  return (obj: Record<string, any>): Record<string, any> => {
    return _.mapKeys(obj, (value, key) => _.snakeCase(key));
  };
};
