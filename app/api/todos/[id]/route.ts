import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// algorithm for update todo
// 1 check user is authenticate or not
// 2  take id param and stote in raw id
// 3-convert id into number
// 4- check id is integer or not
// 5- check if title.trim().length>0
// 6- take optional fields from body 
// 7- check optional fields datatype
// 8- check if todo exist
// 9 - update todo
// 10- send response    


//  algorithm for delete todo

// 1 check user is authenticate or not
// 2  take id param and stote in raw id
// 3-convert id into number
// 4- check id is integer or not
// 5- check if todo exist
// 6- delete todo
// 7- send response   





export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

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
        const rawid = (await params).id
        const id = Number(rawid)
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ message: "invalid id" }, { status: 400 })
        }

        const { title, description, completed } = await request.json()
        if (title !== undefined && typeof title !== "string") {
            return NextResponse.json({ message: "title must be string" }, { status: 400 })
        }
        if (title !== undefined && title.trim().length <= 0) {
            return NextResponse.json({ message: "title is required" }, { status: 400 })
        }

        
        if (completed !== undefined && typeof completed !== "boolean") {
            return NextResponse.json({ message: "completed must be boolean" }, { status: 400 })
        }

        const existing = await prisma.todo.findFirst({ where: { id: id, userId: userId } })
        if (!existing) {
            return NextResponse.json({ message: "todo not found" }, { status: 404 })
        }

        let completedAt: Date | null | undefined = undefined
        if (completed === true && !existing.completed) {
            completedAt = new Date()
        }
        if (completed === false) {
            completedAt = null
        }



        const updateTodo = await prisma.todo.update({
            where: { id: id, userId: userId },
            data: {
                title: title,
                description: description,
                completed: completed,
                completedAt:completedAt
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
        const rawid = (await params).id
        const id = Number(rawid)
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ message: "invalid id" }, { status: 400 })
        }

        const deleteTodo = await prisma.todo.delete({
            where: { id: id, userId: userId }
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