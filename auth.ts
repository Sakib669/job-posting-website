import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./src/lib/prisma";

export const { authOptions, hadnler, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [GoogleProvider({
+     clientId: process.env.GOOGLE_CLIENT_ID!,
+     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
+   }),
+   GithubProvider({
+     clientId: process.env.GITHUB_CLIENT_ID!,
+     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
+   }),],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as String;
        session.user.name = token.name as String;
      }
      return session;
    },
  },
});
