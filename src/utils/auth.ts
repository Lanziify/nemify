import { betterAuth } from 'better-auth';
import { admin, organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import { ac } from '@/data/permissions';
import { transporter } from './email';
import { checkSystemUserRole } from '@/feature/multi-tenancy/repositories/tenancy.repository';
import { safeCatch } from '@/lib/errors/safe-catch';
import { actionErrorParser } from '@/lib/errors/action-error-parser';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: process.env.ADMIN_FROM!,
        to: user.email,
        subject: 'Verify your email',
        html: `
          <h1>Verify your account</h1>
          <p>Click below:</p>
          <a href="${url}">Verify Email</a>
        `,
      });
    },
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
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day - update session if older than this
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes - cache the session lookup for 5 minutes
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
      allowUserToCreateOrganization: async (user) => {
        const { data } = await safeCatch(
          async () => {
            return await checkSystemUserRole(user.id);
          },
          { parser: actionErrorParser }
        );

        return data ? true : false;
      },
    }),
    nextCookies(),
  ],
});

export type AuthType = typeof auth.$Infer