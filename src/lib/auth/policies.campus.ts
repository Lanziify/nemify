import { Policy } from './policies';

export const CAMPUS_POLICIES = {
  campus: {
    label: 'Campus',
    description: 'Manage campus information and settings',

    actions: {
      create: {
        label: 'Create Campus',
        description: 'Can create a campus',
      },

      read: {
        label: 'View Campus',
        description: 'Can view campus information',
      },

      update: {
        label: 'Update Campus',
        description: 'Can edit campus details and settings',
      },

      delete: {
        label: 'Delete Campus',
        description: 'Can permanently delete the campus',
      },
    },
  },

  member: {
    label: 'Member Management',
    description: 'Manage members inside the campus',

    actions: {
      invite: {
        label: 'Invite Members',
        description: 'Can invite users into the campus',
      },

      read: {
        label: 'View Members',
        description: 'Can view campus members',
      },

      update: {
        label: 'Update Members',
        description: 'Can modify member information',
      },

      remove: {
        label: 'Remove Members',
        description: 'Can remove members from the campus',
      },
    },
  },

  invitation: {
    label: 'Invitation Management',
    description: 'Manage campus invitations',

    actions: {
      create: {
        label: 'Create Invitation',
        description: 'Can send invitations',
      },

      read: {
        label: 'View Invitations',
        description: 'Can view pending invitations',
      },

      revoke: {
        label: 'Revoke Invitation',
        description: 'Can cancel invitations',
      },
    },
  },

  role: {
    label: 'Role Assignment',
    description: 'Assign roles to members',

    actions: {
      assign: {
        label: 'Assign Roles',
        description: 'Can assign roles to members',
      },

      update: {
        label: 'Update Assigned Roles',
        description: 'Can change member roles',
      },
    },
  },

  ac: {
    label: 'Access Control',
    description: 'Manage dynamic roles and permissions',

    actions: {
      create: {
        label: 'Create Role',
        description: 'Can create organization roles',
      },

      read: {
        label: 'View Roles',
        description: 'Can view organization roles',
      },

      update: {
        label: 'Update Role',
        description: 'Can modify organization roles',
      },

      delete: {
        label: 'Delete Role',
        description: 'Can remove organization roles',
      },
    },
  },
} as const satisfies Policy;
