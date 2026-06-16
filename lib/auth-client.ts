import { createAuthClient } from "better-auth/client";

const baseURL = process.env.BETTER_AUTH_URL!;

const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, signOut, useSession } = authClient;

export const signInByGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
};
