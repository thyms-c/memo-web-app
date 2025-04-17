import withAuth from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (
        req.nextUrl.pathname.startsWith("/api/auth") ||
        req.nextUrl.pathname === "/auth/login"
      ) {
        return true;
      }

      if (token === null) {
        return false;
      }

      return true;
    },
  },
});
