import z from 'zod';

export const signUpEmailSchema = z.object({
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
  image: z.string().optional(),
  callbackURL: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

export type SignUpEmailValues = z.infer<typeof signUpEmailSchema>;

export const signInEmailPasswordSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  callbackURL: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

export type SignInEmailPasswordValues = z.infer<
  typeof signInEmailPasswordSchema
>;
