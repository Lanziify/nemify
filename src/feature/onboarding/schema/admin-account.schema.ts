import z from 'zod';

export const adminAccountSetupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  callbackURL: z.string().optional()
})

export type AdminAccountSetupSchema = typeof adminAccountSetupSchema;
export type AdminAccountSetupFormValues = z.infer<AdminAccountSetupSchema>;
