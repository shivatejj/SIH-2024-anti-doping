import { DefaultSession } from "next-auth";
declare module "next-auth" {
  export interface Session {
    user: {
      id: string;
      userId: string;
      name: string;
      email: string;
      role: "user" | "admin";
      score: number;
      attempts: number;
      level: "easy" | "medium" | "hard";
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: "user" | "admin";
    score: number;
    attempts: number;
    level: "easy" | "medium" | "hard";
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: "user" | "admin";
    score: number;
    attempts: number;
    level: "easy" | "medium" | "hard";
    accessToken: string;
  }
}