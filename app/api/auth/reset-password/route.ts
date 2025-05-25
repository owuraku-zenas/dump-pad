import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { createTransport } from "nodemailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = await bcrypt.hash(resetToken, 10)

    // Store token in database
    await db.passwordResetToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: new Date(Date.now() + 3600000), // 1 hour
      },
    })

    // Create email transport
    const transport = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    // Send email
    await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    return NextResponse.json({ message: "Password reset email sent" })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Error processing password reset" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { token, password } = await req.json()

    // Find all non-expired reset tokens for this token
    const resetTokens = await db.passwordResetToken.findMany({
      where: {
        expires: {
          gt: new Date()
        }
      }
    })

    // Find the matching token by comparing hashes
    const resetToken = await Promise.all(
      resetTokens.map(async (rt) => {
        const isValid = await bcrypt.compare(token, rt.token)
        return isValid ? rt : null
      })
    ).then((results) => results.find((result) => result !== null))

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await db.user.update({
      where: { email: resetToken.identifier },
      data: { password: hashedPassword }
    })

    // Delete the used token
    await db.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json(
      { error: "Error updating password" },
      { status: 500 }
    )
  }
} 