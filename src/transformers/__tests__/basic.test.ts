import { capitalize, isoDateToLocal, mapItems, transformField } from '../basic';

describe('Basic Transformers', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      const result = capitalize('hello world');
      expect(result).toBe('Hello world');
    });

    it('should handle empty strings', () => {
      const result = capitalize('');
      expect(result).toBe('');
    });

    it('should handle single characters', () => {
      const result = capitalize('a');
      expect(result).toBe('A');
    });
  });

  describe('isoDateToLocal', () => {
    it('should convert ISO date string to Date object', () => {
      const isoString = '2023-12-25T10:30:00Z';
      const result = isoDateToLocal(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2023);
    });
  });
});

describe('Higher-Order Transformers', () => {
  describe('mapItems', () => {
    const capitalizeAll = mapItems(capitalize);

    it('should apply transformer to each item in the array', () => {
      const result = capitalizeAll(['hello', 'world', 'test']);
      expect(result).toEqual(['Hello', 'World', 'Test']);
    });

    it('should handle empty arrays', () => {
      const result = capitalizeAll([]);
      expect(result).toEqual([]);
    });
  });

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
});
