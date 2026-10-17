import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

        // alogrithm
        //1 check if user is authenticated
        //2 check if user is admin
        //3 destructure target id
        //4 validate body
        //5 update user subscription status
        //6 return updated user
        //7 handle errors

    try {
        // check user is Aunthecated or not
        const { isAuthenticated, userId } = await auth()
        if (!isAuthenticated) {
            return NextResponse.json
                (
                    {
                        message: "user is not authenticated"
                    }
                    , {
                        status: 401
                    }
                )
        }
        // check user is admin or not
        const me = await prisma.user.findUnique({ where: { id: userId } })
        if (me?.role !== "ADMIN") {
            return NextResponse.json({
                message: "user is not authorized to access this resource"
            }, {
                status: 403
            })
        }
        // destructuring target id
        const targetId = (await params).id
        // validate body
        const { isSubscribed } = await request.json()
        // validate body
        if (typeof isSubscribed !== "boolean") {
            return NextResponse.json({ message: "body must contain a boolean value" }, { status: 400 })
        }
        // update user subscription status
        const updatedUser = await prisma.user.update({
            where: { id: targetId },
            data: { isSubscribed: isSubscribed },
            select: { id: true, isSubscribed: true },
        })

        return NextResponse.json(
        { data: updatedUser, message: "user subscription updated successfully" },
        { status: 200 }
        )

    } catch (error: any) {
        console.log(error)
        if (error.code === "P2025") {
            return NextResponse.json({ data: null, message: "user id not found " }, { status: 404 })
        }
        return NextResponse.json({ data: null, message: "database failed" }, { status: 500 })
    }
}