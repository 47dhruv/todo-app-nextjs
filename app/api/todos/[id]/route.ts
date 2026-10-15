import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";



export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

             const {isAuthenticated,userId}=await auth() 
                 if (!isAuthenticated) {
                        return  NextResponse.json
                        (
                            {
                                message:"user is not authenticated"
                            }
                            ,{
                                status:401
                            }
                        )
                    }
        const rawid = (await params).id
        const id = Number(rawid)
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ message: "invalid id" }, { status: 400 })
        }

        const { title, description, completed } = await request.json()
        if (title !== undefined && title.trim().length <= 0) {
            return NextResponse.json({ message: "title is required" }, { status: 400 })
        }

        const updateTodo = await prisma.todo.update({
            where: { id: id ,userId:userId},
            data: {
                title: title,
                description: description,
                completed: completed
            }
        })
        return NextResponse.json({ data: updateTodo, message: "todo updated successfully" }, { status: 200 })


    } catch (error: any) {
        console.log(error)
                if (error.code === "P2025") {
            return NextResponse.json({ data: null, message: "todo not found" }, { status: 404 })
        }
        return NextResponse.json({ data: null, message: "database failed" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

         const {isAuthenticated,userId}=await auth() 
                 if (!isAuthenticated) {
                        return  NextResponse.json
                        (
                            {
                                message:"user is not authenticated"
                            }
                            ,{
                                status:401
                            }
                        )
                    }
        const rawid = (await params).id
        const id = Number(rawid)
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ message: "invalid id" }, { status: 400 })
        }

        const deleteTodo = await prisma.todo.delete({
            where: { id: id,userId:userId }
        })
        return NextResponse.json({ data: deleteTodo, message: "todo deleted successfully" }, { status: 200 })


    } catch (error: any) {
        console.log(error)
        if (error.code === "P2025") {
            return NextResponse.json({ data: null, message: "todo not found" }, { status: 404 })
        }
        return NextResponse.json({ data: null, message: "database failed" }, { status: 500 })
    }
}