import { MOCK_ADMIN_USER } from '../dev-tool/types';
import { user as navUser } from '@/slices/sidebar/menu/nav-user/config';

// Temporary hook to get user ID - replace with actual auth system later
export function useUser() {
  return {
    userId: MOCK_ADMIN_USER.id,
    userName: MOCK_ADMIN_USER.name,
    userEmail: MOCK_ADMIN_USER.email,
    avatar: navUser.avatar,
    role: navUser.role,
    isLoading: false,
    error: null
  };
}
