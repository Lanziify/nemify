import { betterAuth } from 'better-auth';
import { admin, organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import { inferOrgAdditionalFields } from 'better-auth/client/plugins';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
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
  plugins: [
    nextCookies(),
    admin(),
    organization({
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
        session: {
          fields: {
            activeOrganizationId: "activeCampusId"
          }
        }
      },
    }),
  ],
});
