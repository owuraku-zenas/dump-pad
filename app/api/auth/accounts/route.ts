import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/auth/accounts - Get user's connected accounts
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const accounts = await db.account.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
        type: true,
      },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("[ACCOUNTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// DELETE /api/auth/accounts/:provider - Disconnect an account
export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider")

    if (!provider) {
      return new NextResponse("Provider is required", { status: 400 })
    }

    // Don't allow disconnecting the last account
    const accounts = await db.account.findMany({
      where: {
        userId: session.user.id,
      },
    })

    if (accounts.length <= 1) {
      return new NextResponse("Cannot disconnect the last account", { status: 400 })
    }

    await db.account.deleteMany({
      where: {
        userId: session.user.id,
        provider,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ACCOUNTS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 