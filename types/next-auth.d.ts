import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  interface Session {
    user?: User;
    expires: Date;
  }

  interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    token: string;
  }
}
