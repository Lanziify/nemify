import { createAccessControl } from 'better-auth/plugins';
import { getPolicyStatement } from './policies';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';
import { CAMPUS_POLICIES } from './policies.campus';

export const campusStatement = getPolicyStatement(CAMPUS_POLICIES);

export const platformAccessControl = createAccessControl({
  ...defaultStatements,
});
export const campusAccessControl = createAccessControl(campusStatement);

export const globalRoles = {
  admin: platformAccessControl.newRole({
    ...adminAc.statements,
  }),
  user: platformAccessControl.newRole({}),
};

export const campusRoles = {
  owner: campusAccessControl.newRole({
    campus: ['create', 'read', 'update', 'delete'],

    member: ['invite', 'read', 'update', 'remove'],

    invitation: ['create', 'read', 'revoke'],

    role: ['assign', 'update'],

    ac: ['create', 'read', 'update', 'delete'],
  }),
};
