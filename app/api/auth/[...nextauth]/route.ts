import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { Adapter } from "next-auth/adapters";

const handler = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Credentials({
    //   credentials: {
    //     username: { label: "Username" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const response = await fetch(request)
    //     if (!response.ok) return null
    //     return (await response.json()) ?? null
    //   },
    // }),
  ],
});

export { handler as GET, handler as POST };
