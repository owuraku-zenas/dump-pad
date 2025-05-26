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
import { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"

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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          subject: `Sign in to ${host}`,
          text: `Click here to sign in to ${host}: ${url}`,
          html: `<p>Click <a href="${url}">here</a> to sign in to ${host}</p>`,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions)

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