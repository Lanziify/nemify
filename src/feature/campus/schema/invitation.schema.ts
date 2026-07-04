import z from 'zod';
import { CreateInvitationBody } from '../services/invitation.service';

export const createCampusInvitationSchema = z.object({
  email: z.email(),
  role: z.string(),
  organizationId: z.string(),
  resend: z.boolean().optional(),
}) satisfies z.ZodType<CreateInvitationBody>;

export type CreateCampusInvitationSchema = typeof createCampusInvitationSchema;
export type CreateCampusInvitationFormValues =
  z.infer<CreateCampusInvitationSchema>;

export const createOwnerInvitationSchema = z.object({
  organizationId: z.string(),
  recipientEmail: z.email(),
  inviterEmail: z.email(),
});

export type CreateOwnerInvitationSchema = typeof createOwnerInvitationSchema;
export type CreateOwnerInvitationFormValues =
  z.infer<CreateOwnerInvitationSchema>;
