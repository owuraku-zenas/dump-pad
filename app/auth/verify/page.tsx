import { verify } from "jsonwebtoken"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

interface VerifyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams
  const token = params.token as string | undefined

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Verification Link</h1>
          <p className="mt-2 text-gray-600">The verification link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  if (!process.env.NEXTAUTH_SECRET) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
          <p className="mt-2 text-gray-600">NEXTAUTH_SECRET is not configured.</p>
        </div>
      </div>
    )
  }

  try {
    // Verify the token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET) as { email: string }
    const { email } = decoded

    if (!email) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid Token Format</h1>
            <p className="mt-2 text-gray-600">The verification link is invalid.</p>
          </div>
        </div>
      )
    }

    // Find the verification token in the database
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
        identifier: email,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!verificationToken) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid or Expired Token</h1>
            <p className="mt-2 text-gray-600">The verification link has expired or is invalid.</p>
          </div>
        </div>
      )
    }

    // Update user's email verification status
    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete the used verification token using the compound unique identifier
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    })

    // Redirect to home page
    redirect("/")
  } catch (error) {
    // Only log and show errors that aren't redirects
    if (!(error instanceof Error && error.message === "NEXT_REDIRECT")) {
      console.error("Verification error details:", error)
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
            <p className="mt-2 text-gray-600">
              {error instanceof Error ? error.message : "There was an error verifying your email address."}
            </p>
          </div>
        </div>
      )
    }
    // Re-throw redirect errors to let Next.js handle them
    throw error
  }
} 