import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const setupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    
    // Check if user already has a name
    const existingUser = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        name: true,
      },
    })

    // If this is just a check (no name in body) and user has a name, return success
    if (!body.name && existingUser?.name) {
      return NextResponse.json({ message: "User already set up" })
    }

    // If name is provided, validate it
    if (body.name) {
      const { name } = setupSchema.parse(body)
      
      // Update the user's name
      const user = await db.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })

      return NextResponse.json(user)
    }

    // If no name provided and user doesn't have a name, return error
    return NextResponse.json(
      { message: "Name is required" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[USER_SETUP]", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    )
  }
} 