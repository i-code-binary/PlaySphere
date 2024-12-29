import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../models/prismaClient";
import NextAuth, { DefaultSession, AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

type Role = "USER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
  }

  interface JWT {
    role?: Role;
    id?: string;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: "USER" as Role, // Default role for OAuth users
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                role: "USER",
                accounts: {
                  create: {
                    type: "oauth",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at,
                  },
                },
              },
            });
            if (!newUser) return false;
            return true;
          }

          if (existingUser && !existingUser.accounts.length) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: "oauth",
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            });
          }
          return true;
        }
        return true;
      } catch (error) {
        console.log("Error at signIn callback", error);
        return false;
      }
    },
    async jwt({ token, user, account,/*profile */ }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
      }

      // If it's a first time sign in via OAuth
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          select: { role: true, id: true, email: true },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
          token.email = dbUser.email;
        }
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
          email: token.email as string,
        },
      };
    },
  },
  events: {
    async signIn({ user, account, /*profile*/ isNewUser }) {
      if (account?.provider === "google" && isNewUser) {
        // Additional actions for new OAuth users if needed
        console.log("New user signed up via Google:", user.email);
      }
    },
  },
  pages: {
    signIn: "/authentication",
    error: "/authentication/error", // Add an error page to handle OAuth errors
  },
  secret: process.env.NEXTAUTH_SECRET,
};


