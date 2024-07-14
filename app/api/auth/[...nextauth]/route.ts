import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "database", // Explicit strategy required for Credentials provider
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        };
      }

      // User is not available TODO DELETE ME
      return {
        ...session,
        user: {
          ...session.user,
        },
      };
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
});

export { handler as GET, handler as POST };
