import { BidirectionalAdapter } from '@/types';
import { capitalize, isoDateToLocal } from '@/transformers';

// API response types
interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

// UI expected types
interface UiUser {
  id: string;
  displayName: string;
  email: string;
  joinedDate: Date;
  isActive: boolean;
}

// Create the bidirectional adapter
export const userAdapter: BidirectionalAdapter<ApiUser, UiUser> = {
  toUi: (apiUser: ApiUser): UiUser => ({
    id: apiUser.id,
    displayName: `${capitalize(apiUser.first_name)} ${capitalize(
      apiUser.last_name
    )}`,
    email: apiUser.email,
    joinedDate: isoDateToLocal(apiUser.created_at),
    isActive: apiUser.is_active,
  }),

  toApi: (uiUser: UiUser): ApiUser => {
    const [firstName, ...lastNameParts] = uiUser.displayName.split(' ');
    return {
      id: uiUser.id,
      first_name: firstName.toLowerCase(),
      last_name: lastNameParts.join(' ').toLowerCase(),
      email: uiUser.email,
      created_at: uiUser.joinedDate.toISOString(),
      is_active: uiUser.isActive,
    };
  },
};
