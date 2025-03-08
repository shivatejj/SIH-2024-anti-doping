import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Activity from "@/models/Activity";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

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

        await Activity.create({ name: user.name, email: user.email, loginTime: new Date() });

        const accessToken = jwt.sign(
          {
            userId: user.userId,
            role: user.role,
            name: user.name,
            email: user.email,
            level: user.level
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        return {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          score: user.score,
          attempts: user.attempts,
          level: user.level,
          accessToken
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user = token.user as Session['user'];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
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
