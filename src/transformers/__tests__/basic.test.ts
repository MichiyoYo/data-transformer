import { capitalize, isoDateToLocal } from '../basic';

const transformers = {
  capitalize,
  isoDateToLocal,
};

describe('Basic Transformers', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      const result = transformers.capitalize('hello world');
      expect(result).toBe('Hello world');
    });

    it('should handle empty strings', () => {
      const result = transformers.capitalize('');
      expect(result).toBe('');
    });

    it('should handle single characters', () => {
      const result = transformers.capitalize('a');
      expect(result).toBe('A');
    });
  });

  describe('isoDateToLocal', () => {
    it('should convert ISO date string to Date object', () => {
      const isoString = '2023-12-25T10:30:00Z';
      const result = transformers.isoDateToLocal(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2023);
    });
  });
});
