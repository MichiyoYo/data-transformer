import {
  filterItems,
  sortItems,
  groupBy,
  uniqueBy,
  findItem,
  mapItems,
  reduceItems,
} from '../array';
import { capitalize } from '../string';

describe('Array Transformers', () => {
  const testUsers = [
    { id: 1, name: 'Alice', age: 25, role: 'admin', isActive: true },
    { id: 2, name: 'Bob', age: 30, role: 'user', isActive: false },
    { id: 3, name: 'Charlie', age: 25, role: 'user', isActive: true },
    { id: 4, name: 'David', age: 35, role: 'admin', isActive: true },
    { id: 5, name: 'Alice', age: 28, role: 'user', isActive: true }, // duplicate name
  ];

  describe('mapItems', () => {
    it('should apply transformer to each item in array', () => {
      const capitalizeAll = mapItems(capitalize);
      const result = capitalizeAll(['hello', 'world', 'test']);
      expect(result).toEqual(['Hello', 'World', 'Test']);
    });

    it('should handle empty arrays', () => {
      const capitalizeAll = mapItems(capitalize);
      const result = capitalizeAll([]);
      expect(result).toEqual([]);
    });
  });

  describe('filterItems', () => {
    it('should filter items based on predicate', () => {
      const filterActive = filterItems((user: any) => user.isActive);
      const result = filterActive(testUsers);

      expect(result).toHaveLength(4);
      expect(result.every((user) => user.isActive)).toBe(true);
    });

    it('should filter by property value', () => {
      const filterAdmins = filterItems((user: any) => user.role === 'admin');
      const result = filterAdmins(testUsers);

      expect(result).toHaveLength(2);
      expect(result.every((user) => user.role === 'admin')).toBe(true);
    });
  });

  describe('sortItems', () => {
    it('should sort items by property (ascending)', () => {
      const sortByAge = sortItems((user: any) => user.age);
      const result = sortByAge(testUsers);

      expect(result[0].age).toBe(25);
      expect(result[result.length - 1].age).toBe(35);
    });

    it('should sort items by property (descending)', () => {
      const sortByAgeDesc = sortItems((user: any) => user.age, false);
      const result = sortByAgeDesc(testUsers);

      expect(result[0].age).toBe(35);
      expect(result[result.length - 1].age).toBe(25);
    });

    it('should sort items by string property', () => {
      const sortByName = sortItems((user: any) => user.name);
      const result = sortByName(testUsers);

      expect(result[0].name).toBe('Alice');
      expect(result[result.length - 1].name).toBe('David');
    });
  });

  describe('groupBy', () => {
    it('should group items by property', () => {
      const groupByRole = groupBy((user: any) => user.role);
      const result = groupByRole(testUsers);

      expect(result.admin).toHaveLength(2);
      expect(result.user).toHaveLength(3);
    });

    it('should group items by computed value', () => {
      const groupByAgeGroup = groupBy((user: any) =>
        user.age >= 30 ? 'senior' : 'junior'
      );
      const result = groupByAgeGroup(testUsers);

      expect(result.junior).toHaveLength(3);
      expect(result.senior).toHaveLength(2);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by property', () => {
      const uniqueByName = uniqueBy((user: any) => user.name);
      const result = uniqueByName(testUsers);

      expect(result).toHaveLength(4); // 5 users, but 2 named Alice
      expect(result.filter((user) => user.name === 'Alice')).toHaveLength(1);
    });

    it('should remove duplicates by age', () => {
      const uniqueByAge = uniqueBy((user: any) => user.age);
      const result = uniqueByAge(testUsers);

      expect(result).toHaveLength(4); // 5 users, but 2 aged 25
      expect(result.filter((user) => user.age === 25)).toHaveLength(1);
    });
  });

  describe('findItem', () => {
    it('should find first item matching predicate', () => {
      const findAdmin = findItem((user: any) => user.role === 'admin');
      const result = findAdmin(testUsers);

      expect(result).toBeDefined();
      expect(result?.role).toBe('admin');
      expect(result?.name).toBe('Alice'); // first admin
    });

    it('should return undefined if no match found', () => {
      const findSuperuser = findItem((user: any) => user.role === 'superuser');
      const result = findSuperuser(testUsers);

      expect(result).toBeUndefined();
    });
  });

  describe('reduceItems', () => {
    it('should reduce array to single value', () => {
      const sumAges = reduceItems(
        (sum: number, user: any) => sum + user.age,
        0
      );
      const result = sumAges(testUsers);

      expect(result).toBe(143); // 25+30+25+35+28
    });

    it('should reduce to object', () => {
      const countByRole = reduceItems((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      const result = countByRole(testUsers);

      expect(result).toEqual({ admin: 2, user: 3 });
    });
  });
});
