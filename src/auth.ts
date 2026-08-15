import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Google,
    Credentials({
      id: "otp",
      name: "ورود با کد ایمیل",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        code: { label: "کد تأیید", type: "text" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const code = typeof credentials?.code === "string" ? credentials.code.trim() : "";

        if (!email || !code) return null;

        const otp = await prisma.emailOtp.findFirst({
          where: { email },
          orderBy: { createdAt: "desc" },
        });

        if (!otp) return null;
        if (otp.code !== code) return null;
        if (otp.expiresAt < new Date()) return null;

        await prisma.emailOtp.delete({ where: { id: otp.id } });

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              role: "USER",
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;

      const userId = token.id ?? token.sub ?? user?.id;

      if (userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            firstName: true,
            lastName: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.role = dbUser.role;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
        session.user.role = token.role ?? "USER";
        session.user.firstName = token.firstName ?? null;
        session.user.lastName = token.lastName ?? null;
      }
      return session;
    },
  },
});
