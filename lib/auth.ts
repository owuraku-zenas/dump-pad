import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

// Custom adapter to handle account linking
const customAdapter = {
  ...PrismaAdapter(db),
  async getUserByAccount({ provider, providerAccountId }) {
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
      return account.user
    } catch (error) {
      console.error("Error in getUserByAccount:", error)
      return null
    }
  },
  async linkAccount(account) {
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
        return await db.account.update({
          where: { id: existingAccount.id },
          data: {
            userId: account.userId,
            access_token: account.access_token,
            token_type: account.token_type,
            scope: account.scope,
          },
        })
      }

      // If no existing account, create new one
      return await db.account.create({
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
        console.log("GitHub Profile Data:", JSON.stringify(profile, null, 2))
        return {
          id: profile.id.toString(),
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        console.log("Google Profile Data:", JSON.stringify(profile, null, 2))
        return {
          id: profile.sub,
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
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
      console.log("SignIn Callback Data:", {
        user: JSON.stringify(user, null, 2),
        account: JSON.stringify(account, null, 2),
        profile: JSON.stringify(profile, null, 2)
      })
      
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Check for existing user with the same email
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          })

          if (existingUser) {
            // Only update image if needed
            if (!existingUser.image) {
              await db.user.update({
                where: { id: existingUser.id },
                data: {
                  image: user.image,
                }
              })
            }
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
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
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
          email: token.email,
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