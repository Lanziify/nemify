import { betterAuth } from 'better-auth';
import { admin, organization } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from './db';
import {
  platformAccessControl,
  globalRoles,
  campusAccessControl,
  campusRoles,
} from '@/lib/auth/permissions';
import { transporter } from './email';

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
      authorizationParams: {
        prompt: 'select_account',
      },
    },
  },
  database: {
    db: db,
    type: 'postgres',
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
    admin({
      ac: platformAccessControl,
      roles: globalRoles,
    }),
    organization({
      ac: campusAccessControl,
      roles: campusRoles,
      teams: {
        enabled: true,
      },
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
            teamId: 'departmentId',
          },
        },
        organizationRole: {
          modelName: 'campusRole',
          fields: {
            organizationId: 'campusId',
          },
        },
        team: {
          modelName: 'department',
          fields: {
            organizationId: 'campusId',
          },
        },
        teamMember: {
          modelName: 'departmentMember',
          fields: {
            teamId: 'departmentId',
          },
        },
        session: {
          fields: {
            activeOrganizationId: 'activeCampusId',
            activeTeamId: 'activeDepartmentId',
          },
        },
      },
      allowUserToCreateOrganization: (user) => {
        const inferedUser = user as AuthType['Session']['user'];

        const isUserAdmin = inferedUser.role === 'admin';

        if (!isUserAdmin) return false;

        return true;
      },
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/invite/campus-invitation?id=${data.id}`;

        await transporter.sendMail({
          from: process.env.ADMIN_FROM!,
          to: data.email,
          subject: `You're invited to join ${data.organization.name}`,
          html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        
        <h2 style="margin-bottom: 16px;">
          You've been invited 🎉
        </h2>

        <p style="font-size: 16px; line-height: 1.6;">
          Hi,
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          <strong>${data.inviter.user.name}</strong> 
          (${data.inviter.user.email}) has invited you to join 
          <strong>${data.organization.name}</strong>.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Click the button below to accept your invitation:
        </p>

        <div style="margin: 32px 0;">
          <a 
            href="${inviteLink}"
            style="
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 8px;
              display: inline-block;
              font-weight: 600;
            "
          >
            Accept Invitation
          </a>
        </div>

        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="font-size: 14px; word-break: break-all;">
          <a href="${inviteLink}">${inviteLink}</a>
        </p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #999;">
          If you weren’t expecting this invitation, you can safely ignore this email.
        </p>

      </div>
    `,
        });
      },
    }),
    nextCookies(),
  ],
});

export type AuthType = typeof auth.$Infer;
