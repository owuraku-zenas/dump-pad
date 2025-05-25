import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"

// Custom adapter to handle account linking
const customAdapter: Adapter = {
  ...PrismaAdapter(db),
  async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
    try {
      // First try to find the account
      const account = await db.account.findFirst({
        where: {
          provider,
          providerAccountId,
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      // If we found an account, return the associated user
      return account.user as AdapterUser
    } catch (error) {
      console.error("Error in getUserByAccount:", error)
      return null
    }
  },
  async linkAccount(account: AdapterAccount) {
    try {
      // Check if this GitHub account is already linked
      const existingAccount = await db.account.findFirst({
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      })

      if (existingAccount) {
        // If account exists, update it
        await db.account.update({
          where: { id: existingAccount.id },
          data: {
            userId: account.userId,
            access_token: account.access_token,
            token_type: account.token_type,
            scope: account.scope,
          },
        })
        return
      }

      // If no existing account, create new one
      await db.account.create({
        data: account,
      })
    } catch (error) {
      console.error("Error in linkAccount:", error)
      throw error
    }
  },
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>) {
        if (!credentials?.email || !credentials?.password || 
            typeof credentials.email !== 'string' || 
            typeof credentials.password !== 'string') {
          throw new Error("Invalid credentials")
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user?.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Check for existing user with the same email
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          })

          if (existingUser) {
            // Update user data if needed
            await db.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              }
            })
            return true
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return true
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      
      // Always fetch fresh data from the database
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email as string,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      })

      if (dbUser) {
        token.id = dbUser.id
        token.name = dbUser.name
        token.email = dbUser.email
        token.picture = dbUser.image
      }

      return token
    }
  }
}) 