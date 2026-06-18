import { betterAuth } from 'better-auth';
import { admin, organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import { ac } from '@/data/permissions';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  database: {
    db: db,
    type: 'postgres',
  },
  user: {
    additionalFields: {
      platformRole: {
        type: 'string',
        required: true,
        defaultValue: 'system_user',
        input: false,
      },
    },
  },
  plugins: [
    admin(),
    organization({
      ac,
      dynamicAccessControl: {
        enabled: true,
      },
      schema: {
        organization: {
          modelName: 'campus',
        },
        member: {
          modelName: 'campusMember',
          fields: {
            organizationId: 'campusId',
          },
        },
        invitation: {
          modelName: 'campusInvitation',
          fields: {
            organizationId: 'campusId',
          },
        },
        organizationRole: {
          modelName: 'campusRole',
          fields: {
            organizationId: 'campusId',
          },
        },
        session: {
          fields: {
            activeOrganizationId: 'activeCampusId',
          },
        },
      },
    }),
    nextCookies(),
  ],
});
