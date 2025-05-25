import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"
import { createTransport } from "nodemailer"

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
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24 hours
      sendVerificationRequest: async ({ identifier: email, url, provider: { server, from } }) => {
        const { host } = new URL(url)
        const transport = createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
      },
    }),
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
          throw new Error("Please provide both email and password")
        }

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            throw new Error("No account found with this email")
          }

          if (!user.password) {
            throw new Error("This account was created with a social login")
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email before signing in")
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            throw new Error("Incorrect password")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Error in credentials authorize:", error)
          throw error
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

          // For new users, redirect to new-user page
          return "/auth/new-user"
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

function html({ url, host, email }: { url: string; host: string; email: string }) {
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`
  const newUserUrl = url.replace("/api/auth/callback", "/auth/new-user")
  
  return `
    <body style="background: #f9f9f9;">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
            Sign in to <strong>${escapedHost}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
                  <a href="${newUserUrl}"
                    target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">
                    Verify Email Address
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  `
}

function text({ url, host }: { url: string; host: string }) {
  const newUserUrl = url.replace("/api/auth/callback", "/auth/new-user")
  return `Sign in to ${host}\n\nClick here to verify your email address: ${newUserUrl}\n\n`
} 