import crypto from 'crypto';
import NextAuth, { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Single-admin credentials authentication.
 *
 * Credentials live in server-only environment variables and are REQUIRED:
 * there are no demo/fallback accounts, so a misconfigured deployment can
 * never be logged into with publicly known defaults. If ADMIN_EMAIL or
 * ADMIN_PASSWORD is missing, every sign-in attempt is refused.
 */

/** Constant-time string comparison that tolerates different lengths. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still perform a comparison to keep timing uniform.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const expectedEmail = process.env.ADMIN_EMAIL;
        const expectedPassword = process.env.ADMIN_PASSWORD;

        // No configured admin => refuse every sign-in (no implicit defaults).
        if (!expectedEmail || !expectedPassword) return null;

        const email = credentials?.email ?? '';
        const password = credentials?.password ?? '';

        if (safeEqual(email, expectedEmail) && safeEqual(password, expectedPassword)) {
          return { id: 'site-admin', name: 'Admin', email: expectedEmail };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
};

/** App Router handler used by `app/api/auth/[...nextauth]/route.ts`. */
export const authHandler = NextAuth(authOptions);

/** Read the current session from server components or route handlers. */
export const getServerAuthSession = () => getServerSession(authOptions);
