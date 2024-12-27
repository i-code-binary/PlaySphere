import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../models/prismaClient";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

type Credentials = {
  email: string;
  password: string;
};
const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }
        const { email, password } = credentials;

        // Validate input
        if (!email || !password) {
          throw new Error("Email and Password are required");
        }

        // Fetch user with related payments
        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { payments: true }, // Include the payments relation
        });

        if (!existingUser) {
          throw new Error("User not found");
        }

        if (!existingUser.password) {
          throw new Error("Password not found");
        }

        // Validate password
        const isValid = bcrypt.compareSync(password, existingUser.password);
        if (!isValid) {
          throw new Error("Invalid Password");
        }

        // Return user object
        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          payments: existingUser.payments, // Payments are now included
        };
      },
    }),
  ],
  pages: {
    signIn: "/authentication",
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      session.user.id = user.id;
      session.user.name = user.name;
      session.user.email = user.email;
      session.user.role = user.role;
      session.user.payments = user.payments;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
