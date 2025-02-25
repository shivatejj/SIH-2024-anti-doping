import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../models/User"; // User model (see below)
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("⚠️ Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) {
          throw new Error("❌ User not found");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("❌ Invalid credentials");
        }

        await Activity.create({ name: user.name, email: user.email });
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

export default NextAuth(authOptions);
