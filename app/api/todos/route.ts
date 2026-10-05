import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET() {
  try {
    const todo = await prisma.todo.findMany()


    return NextResponse.json({ todo, message: "todo found succesfully" }, { status: 200 })

  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ mesage: "database failed" }, { status: 500 })

  }
}
export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()
    if (!title) {

      return NextResponse.json({ message: "title is required" }, { status: 400 })
    }
    const createtodo = await prisma.todo.create({
      data: {
        title: title,
        description: description,

      }
    })

    return NextResponse.json({ data: createtodo, message: "todo is created successfully" }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "database failed" }, { status: 500 })

  }

}