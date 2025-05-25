import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await req.json()

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    // Check if user already has a name
    const existingUser = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        name: true,
      },
    })

    if (existingUser?.name) {
      // If user already has a name, just redirect them
      return NextResponse.json({ message: "User already set up" })
    }

    // Update the user's name
    const user = await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_SETUP]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
} 