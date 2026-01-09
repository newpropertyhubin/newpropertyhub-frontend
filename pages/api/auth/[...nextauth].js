import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    (FacebookProvider.default || FacebookProvider)({
      clientId: process.env.META_DEVELOPER_API_ID,
      clientSecret: process.env.META_DEVELOPER_API_KEY,
      httpOptions: { timeout: 10000 },
    }),
    (GoogleProvider.default || GoogleProvider)({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      }
    }),
    (CredentialsProvider.default || CredentialsProvider)({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Backend API (Port 5000) to verify credentials
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/login`;
          console.log("🔐 Attempting Credentials Login to:", apiUrl);
          const res = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),
            headers: { "Content-Type": "application/json" }
          });

          const user = await res.json();

          // If no error and we have user data, return it
          if (res.ok && user) {
            console.log("✅ Login Successful for:", user.email);
            return user;
          }
          console.error("❌ Login Failed. Backend Response:", user);
          return null;
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.role = token.role;
        session.user.token = token.accessToken;
      }
      return session;
    },
  },
};

export default (NextAuth.default || NextAuth)(authOptions);