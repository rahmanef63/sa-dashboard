export interface User {
  id: string;
  email: string;
  name: string;
}

export const MOCK_ADMIN_USER: User = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'admin@example.com',
  name: 'Admin User',
};
