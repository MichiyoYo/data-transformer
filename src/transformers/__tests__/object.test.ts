import { isoDateToLocal } from '../date';
import {
  pickFields,
  omitFields,
  renameFields,
  flattenObject,
  mergeObjects,
  deepClone,
  keysToCamelCase,
  keysToSnakeCase,
  transformField,
} from '../object';
import { capitalize } from '../string';

describe('Object Transformers', () => {
  const testObject = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'New York',
      zip: '10001',
    },
    isActive: true,
  };

  describe('transformField', () => {
    it('should transform a specific field in an object', () => {
      type Person = { id: number; name: string; age: number };
      const transformName = transformField<Person, 'name', string>(
        'name',
        capitalize
      );
      const input: Person = {
        id: 1,
        name: 'john dough',
        age: 30,
      };
      const result = transformName(input);
      expect(result).toEqual({
        id: 1,
        name: 'John dough',
        age: 30,
      });
    });

    it('should transform date field', () => {
      type Item = { id: number; createdAt: string };
      const transformCreatedAt = transformField<Item, 'createdAt', Date>(
        'createdAt',
        isoDateToLocal
      );
      const input: Item = { id: 1, createdAt: '2023-12-25T10:30:00Z' };
      const result = transformCreatedAt(input);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('pickFields', () => {
    it('should pick specified fields from object', () => {
      const picker = pickFields(['id', 'name', 'email']);
      const result = picker(testObject);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should handle non-existent fields gracefully', () => {
      const picker = pickFields(['id', 'nonExistent' as any]);
      const result = picker(testObject);

      expect(result.id).toBe(1);
      expect(result.nonExistent).toBeUndefined();
    });
  });

  describe('omitFields', () => {
    it('should omit specified fields from object', () => {
      const omitter = omitFields(['age', 'address']);
      const result = omitter(testObject);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
      });
    });

    it('should handle non-existent fields gracefully', () => {
      const omitter = omitFields(['nonExistent' as any]);
      const result = omitter(testObject);

      expect(result).toEqual(testObject);
    });
  });

  describe('renameFields', () => {
    it('should rename specified fields', () => {
      const renamer = renameFields({
        name: 'fullName',
        email: 'emailAddress',
        isActive: 'active',
      });
      const result = renamer(testObject);

      expect(result.fullName).toBe('John Doe');
      expect(result.emailAddress).toBe('john@example.com');
      expect(result.active).toBe(true);
      expect(result.name).toBeUndefined();
      expect(result.email).toBeUndefined();
      expect(result.isActive).toBeUndefined();
    });

    it('should handle non-existent source fields', () => {
      const renamer = renameFields({
        nonExistent: 'newName',
      });
      const result = renamer(testObject);

      expect(result.newName).toBeUndefined();
      expect(result).toMatchObject(testObject);
    });
  });

  describe('flattenObject', () => {
    it('should flatten nested object with default separator', () => {
      const flattener = flattenObject();
      const result = flattener(testObject);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        'address.street': '123 Main St',
        'address.city': 'New York',
        'address.zip': '10001',
        isActive: true,
      });
    });

    it('should flatten nested object with custom separator', () => {
      const flattener = flattenObject('_');
      const result = flattener(testObject);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        address_street: '123 Main St',
        address_city: 'New York',
        address_zip: '10001',
        isActive: true,
      });
    });
  });
  describe('mergeObjects', () => {
    it('should merge objects with defaults (override: false)', () => {
      const addDefaults = mergeObjects(false, {
        role: 'user',
        isVerified: false,
        settings: { theme: 'light' },
      });
      const result = addDefaults({ id: 1, name: 'John' });

      expect(result).toEqual({
        id: 1,
        name: 'John',
        role: 'user',
        isVerified: false,
        settings: { theme: 'light' },
      });
    });

    it('should preserve existing values (override: false)', () => {
      const addDefaults = mergeObjects(false, {
        role: 'user',
        isActive: false,
      });
      const result = addDefaults({ id: 1, isActive: true });

      expect(result.isActive).toBe(true); // original value preserved
      expect(result.role).toBe('user'); // default added
    });

    it('should override existing values (override: true)', () => {
      const applyUpdates = mergeObjects(true, {
        role: 'admin',
        isActive: false,
      });
      const result = applyUpdates({ id: 1, isActive: true });

      expect(result.isActive).toBe(false); // value overridden
      expect(result.role).toBe('admin'); // new value added
    });
  });
  describe('deepClone', () => {
    it('should create a deep copy of object', () => {
      const cloned = deepClone(testObject);

      expect(cloned).toEqual(testObject);
      expect(cloned).not.toBe(testObject); // different reference
      expect(cloned.address).not.toBe(testObject.address); // nested objects also cloned
    });

    it('should not affect original when modifying clone', () => {
      const cloned = deepClone(testObject);
      cloned.address.city = 'Boston';

      expect(testObject.address.city).toBe('New York'); // original unchanged
      expect(cloned.address.city).toBe('Boston'); // clone modified
    });
  });

  describe('keysToCamelCase', () => {
    it('should convert snake_case keys to camelCase', () => {
      const snakeCaseObj = {
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
        is_active: true,
      };

      const converter = keysToCamelCase();
      const result = converter(snakeCaseObj);

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        isActive: true,
      });
    });

    it('should handle kebab-case keys', () => {
      const kebabCaseObj = {
        'first-name': 'John',
        'last-name': 'Doe',
        'is-active': true,
      };

      const converter = keysToCamelCase();
      const result = converter(kebabCaseObj);

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
      });
    });
  });

  describe('keysToSnakeCase', () => {
    it('should convert camelCase keys to snake_case', () => {
      const camelCaseObj = {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        isActive: true,
      };

      const converter = keysToSnakeCase();
      const result = converter(camelCaseObj);

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
        is_active: true,
      });
    });

    it('should handle mixed case keys', () => {
      const mixedCaseObj = {
        firstName: 'John',
        'last-name': 'Doe',
        email_address: 'john@example.com',
      };

      const converter = keysToSnakeCase();
      const result = converter(mixedCaseObj);

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      });
    });
  });
});
