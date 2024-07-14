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
  callbacks: {
    session({ session, token, user }) {
      // `session.user.id` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
});

export { handler as GET, handler as POST };
