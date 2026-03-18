import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user: any = null;
        try {
          // Find user by email
          user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          // Register if not found
          if (!user) {
            const role = credentials.email.endsWith("@prof.com") ? "TEACHER" : "STUDENT";
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                password: credentials.password, // In a real app: hash this
                role,
                pseudo: credentials.email.split('@')[0],
                level: 1,
                total_exp: 0,
              }
            });
          } else {
            // Very simplified verification
            if (user.password !== credentials.password) return null;
          }
        } catch (error) {
          console.error("Auth DB Error:", error);
          // Fallback user if DB is down during local testing
          const role = credentials.email.endsWith("@prof.com") ? "TEACHER" : "STUDENT";
          user = {
            id: 'local-test-' + Date.now().toString(),
            email: credentials.email,
            role,
            pseudo: credentials.email.split('@')[0],
            level: 5,
            total_exp: 500,
          };
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          pseudo: user.pseudo,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.pseudo = (user as any).pseudo;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).pseudo = token.pseudo;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-local-dev-12345"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
