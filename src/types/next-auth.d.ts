import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ✅ Add `id` property
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // ✅ Extend User type
  }
}