import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        // Predefined demo credentials with safe fallbacks for clean clones
        const DEFAULT_EMAIL =
          process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "admin@example.com";
        const DEFAULT_PASSWORD =
          process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "admin1234";

        // Accept only the predefined credential pair to keep behavior predictable
        if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
          return {
            id: "demo-user",
            name: "Admin",
            email: DEFAULT_EMAIL,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
};

// App Router API route handler (used by /api/auth/[...nextauth])
export const authHandler = NextAuth(authOptions);

// Helper for server components/routes to read the session
export const getServerAuthSession = () => getServerSession(authOptions);
