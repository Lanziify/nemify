type Policy = {
  [key: string]: PolicyFields;
};

type PolicyFields = {
  label: string;
  description: string;
  actions: Record<string, PolicyActionMeta>;
};

type PolicyActionMeta = {
  label: string;
  description: string;
};

export const POLICIES: Policy = {
  campus: {
    label: 'Campus Management',
    description: 'Manage campuses inside organization',

    actions: {
      create: {
        label: 'Create Campus',
        description: 'Can create new campuses',
      },

      read: {
        label: 'View Campus',
        description: 'Can view campus information',
      },

      update: {
        label: 'Update Campus',
        description: 'Can edit campus details',
      },

      delete: {
        label: 'Delete Campus',
        description: 'Can permanently delete campus',
      },
    },
  },

  member: {
    label: 'Member Management',
    description: 'Manage organization members',

    actions: {
      invite: {
        label: 'Invite Members',
        description: 'Can invite users to organization',
      },

      remove: {
        label: 'Remove Members',
        description: 'Can remove organization members',
      },

      updateRole: {
        label: 'Change Role',
        description: 'Can change member roles',
      },
    },
  },
};

type PermissionMap = Record<string, string[]>;

export function toBetterAuthPermissions(selected: string[]): PermissionMap {
  const permissions: PermissionMap = {};

  for (const item of selected) {
    const [resource, action] = item.split('.');

    permissions[resource] ??= [];
    permissions[resource].push(action);
  }

  return permissions;
}
