import { userAdapter } from '../user-adapter';
describe('User Adapter', () => {
  const mockApiUser = {
    id: '123',
    first_name: 'john',
    last_name: 'doe',
    email: 'john.doe@example.com',
    created_at: '2023-01-15T10:30:00Z',
    is_active: true,
  };

  const mockUiUser = {
    id: '123',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    joinedDate: new Date('2023-01-15T10:30:00Z'),
    isActive: true,
  };

  describe('toUi transformation', () => {
    it('should transform API user to UI format', () => {
      const result = userAdapter.toUi(mockApiUser);

      expect(result.id).toBe('123');
      expect(result.displayName).toBe('John Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.joinedDate).toEqual(new Date('2023-01-15T10:30:00Z'));
      expect(result.isActive).toBe(true);
    });

    it('should handle single name', () => {
      const singleNameUser = {
        ...mockApiUser,
        first_name: 'cher',
        last_name: '',
      };
      const result = userAdapter.toUi(singleNameUser);
      expect(result.displayName).toBe('Cher ');
    });
  });

  describe('toApi transformation', () => {
    it('should transform UI user to API format', () => {
      const result = userAdapter.toApi(mockUiUser);

      expect(result.id).toBe('123');
      expect(result.first_name).toBe('john');
      expect(result.last_name).toBe('doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.created_at).toBe('2023-01-15T10:30:00.000Z');
      expect(result.is_active).toBe(true);
    });

    it('should handle multi-part last names', () => {
      const multiNameUser = { ...mockUiUser, displayName: 'Mary Jane Watson' };
      const result = userAdapter.toApi(multiNameUser);
      expect(result.first_name).toBe('mary');
      expect(result.last_name).toBe('jane watson');
    });
  });
});
