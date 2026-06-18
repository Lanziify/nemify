import z from 'zod';

export const signUpEmailSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  image: z.string().optional(),
  callbackURL: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

export type SignUpEmailValues = z.infer<typeof signUpEmailSchema>;

export const signInEmailPasswordSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInEmailPasswordValues = z.infer<
  typeof signInEmailPasswordSchema
>;
