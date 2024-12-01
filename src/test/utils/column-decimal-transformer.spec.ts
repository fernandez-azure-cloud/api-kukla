import { ColumnDecimalTransformer } from 'src/utils';

describe('ColumnDecimalTransformer', () => {
  let columnDecimalTransformer: ColumnDecimalTransformer;

  beforeEach(() => {
    columnDecimalTransformer = new ColumnDecimalTransformer();
  });

  describe('to', () => {
    it('should return number', () => {
      const result = columnDecimalTransformer.to(123);
      expect(result).toBe(123);
    });
  });

  describe('from', () => {
    it('should return number', () => {
      const result = columnDecimalTransformer.from('123');
      expect(result).toBe(123);
    });

    it('should return null for null value', () => {
      const result = columnDecimalTransformer.from(null);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = columnDecimalTransformer.from('');
      expect(result).toBeNull();
    });
  });
});
