import { createAuthClient } from "better-auth/react";

const baseURL = process.env.BETTER_AUTH_URL!;

const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, signOut, useSession } = authClient;

export const signInByGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};
