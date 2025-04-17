import { jwtDecode } from "jwt-decode";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import {
  DecodedUser,
  UserLoginRequest,
  UserLoginResponse,
} from "@/interfaces/User";
import axios from "@/utils/axios/axios.config";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const payload: UserLoginRequest = {
            username: credentials.username,
            password: credentials.password,
          };

          const user = await axios.post<UserLoginResponse>(
            `${process.env.NEXT_PUBLIC_BASE_API_URL_AUTH}/auth/v1/login`,
            payload
          );

          const response = user.data;

          const decoded = jwtDecode<DecodedUser>(response.token);

          return {
            id: decoded.name,
            username: decoded.name,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            token: response.token,
          };
        } catch (error) {
          console.log("Auth Error", error);

          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
