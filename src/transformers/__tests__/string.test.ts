import { trim, toUpperCase, toLowerCase, slugify, truncate } from '../string';

describe('String Transformers', () => {
  describe('trim', () => {
    it('should remove whitespace from both ends', () => {
      expect(trim('  hello world  ')).toBe('hello world');
    });

    it('should handle strings with no whitespace', () => {
      expect(trim('hello')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(trim('')).toBe('');
    });
  });

  describe('toUpperCase', () => {
    it('should convert string to uppercase', () => {
      expect(toUpperCase('hello world')).toBe('HELLO WORLD');
    });

    it('should handle empty strings', () => {
      expect(toUpperCase('')).toBe('');
    });
  });

  describe('toLowerCase', () => {
    it('should convert string to lowercase', () => {
      expect(toLowerCase('HELLO WORLD')).toBe('hello world');
    });

    it('should handle empty strings', () => {
      expect(toLowerCase('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('This & That @ 2024')).toBe('this-that-2024');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('should handle numbers', () => {
      expect(slugify('Product 123')).toBe('product-123');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings with ellipsis', () => {
      const truncate10 = truncate(10);
      expect(truncate10('This is a very long string')).toBe('This is...');
    });

    it('should not truncate short strings', () => {
      const truncate10 = truncate(10);
      expect(truncate10('Short')).toBe('Short');
    });

    it('should handle exact length', () => {
      const truncate5 = truncate(5);
      expect(truncate5('Hello')).toBe('Hello');
    });
  });
});
