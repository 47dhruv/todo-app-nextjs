import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {

    try {
        
        const { isAuthenticated, userId } = await auth()
        if (!isAuthenticated) {
            return NextResponse.json(
                {
                    message: "user is not authenticated"
                },
                {
                    status: 401
                }
            )
        }
        
        const me = await prisma.user.findUnique({ where: { id: userId } })
        if (me?.role !== "ADMIN") {
            return NextResponse.json({
                message: "user is not authorized to access this resource"
            }, {
                status: 403
            })
        }
        
        const client = await clerkClient()



        const dbUsers = await prisma.user.findMany({
            select: {
                id: true,
                isSubscribed: true,
                role: true,
                _count: {
                    select: {
                        todos: true
                    }
                }
            }
        })


        const { data: clerkUsers } = await client.users.getUserList({
            userId: dbUsers.map((u) => u.id),
            limit: dbUsers.length,
        })
        const users = dbUsers.map((u) => {
  const match = clerkUsers.find((c) => c.id === u.id)
  return { ...u,
    firstname:match?.firstName??null ,
    lastname:match?.lastName?? null,
    username:match?.username ?? null ,
    email: match?.primaryEmailAddress?.emailAddress ?? null}
})

        return NextResponse.json({
            users: users
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}