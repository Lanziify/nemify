import { betterAuth } from 'better-auth';
import { db } from './db';

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
});
