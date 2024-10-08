import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AuthOptions, type DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt", // Explicit strategy required for Credentials provider
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id, // Getting the user id available into the session: Database id into the JWT, then into session from the JWT
        },
      };
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
