import z from 'zod';
import { CreateCampusInvitationBody } from '../services/invitation.service';

export const createCampusInvitationSchema = z.object({
  email: z.email(),
  role: z.string(),
  organizationId: z.string(),
  resend: z.boolean().optional(),
}) satisfies z.ZodType<CreateCampusInvitationBody>;

export type CreateCampusInvitationSchema = typeof createCampusInvitationSchema;
export type CreateCampusInvitationFormValues =
  z.infer<CreateCampusInvitationSchema>;
