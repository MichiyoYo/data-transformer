import { pickFields, omitFields, renameFields, flattenObject } from '../object';

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

      expect(result).toEqual({
        id: 1,
        fullName: 'John Doe',
        emailAddress: 'john@example.com',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
        active: true,
      });
    });

    it('should handle non-existent source fields', () => {
      const renamer = renameFields({
        nonExistent: 'newName',
      } as any);
      const result = renamer(testObject);

      expect(result.newName).toBeUndefined();
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
});
