import {
  toFixed,
  parseInt,
  toInteger,
  parseFloat,
  formatCurrency,
  formatPercentage,
} from '../number';

describe('Number Transformers', () => {
  describe('toFixed', () => {
    it('should format number to specified decimal places', () => {
      const toFixed2 = toFixed(2);
      expect(toFixed2(3.14159)).toBe('3.14');
    });

    it('should handle integers', () => {
      const toFixed2 = toFixed(2);
      expect(toFixed2(5)).toBe('5.00');
    });

    it('should handle zero decimal places', () => {
      const toFixed0 = toFixed(0);
      expect(toFixed0(3.7)).toBe('4');
    });
  });

  describe('parseInt (lenient)', () => {
    it('should parse string to integer', () => {
      expect(parseInt('123')).toBe(123);
    });

    it('should handle strings with numbers and text', () => {
      expect(parseInt('123abc')).toBe(123);
    });

    it('should handle invalid strings', () => {
      expect(parseInt('abc')).toBeNaN();
    });
  });

  describe('toInteger (strict)', () => {
    it('should parse valid numeric strings', () => {
      expect(toInteger('123')).toBe(123);
    });

    it('should return 0 for mixed strings', () => {
      expect(toInteger('123abc')).toBe(0);
    });

    it('should return 0 for invalid strings', () => {
      expect(toInteger('abc')).toBe(0);
    });
  });
  describe('parseFloat', () => {
    it('should parse string to float', () => {
      expect(parseFloat('123.45')).toBe(123.45);
    });

    it('should handle integers', () => {
      expect(parseFloat('123')).toBe(123);
    });

    it('should handle invalid strings', () => {
      expect(parseFloat('abc')).toBeNaN();
    });
  });

  describe('formatCurrency', () => {
    it('should format number as USD currency by default', () => {
      expect(formatCurrency()(1234.56)).toBe('$1,234.56');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency('EUR')(1234.56)).toBe('€1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency()(0)).toBe('$0.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format decimal as percentage', () => {
      const formatPercent2 = formatPercentage(2);
      expect(formatPercent2(0.1234)).toBe('12.34%');
    });

    it('should handle whole numbers', () => {
      const formatPercent0 = formatPercentage(0);
      expect(formatPercent0(0.75)).toBe('75%');
    });

    it('should handle zero', () => {
      const formatPercent2 = formatPercentage(2);
      expect(formatPercent2(0)).toBe('0.00%');
    });
  });
});
