import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { headers } from "next/headers";

const baseURL = process.env.BETTER_AUTH_URL!;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL,
  trustedOrigins: [baseURL, "https://*.vercel.app"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignUpOnSignIn: false,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export type Session = typeof auth.$Infer.Session;
