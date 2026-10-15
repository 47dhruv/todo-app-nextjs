import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


export async function GET() {
   const FREE_TODO_LIMIT = 3
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

        const user = await prisma.user.findUnique({where:{id:userId}})

        const isSubscribed= user?.isSubscribed ??false


    const todo = await prisma.todo.findMany(
      {
        where:{userId:userId},
        orderBy:{createdAt:"desc"},
        take:isSubscribed ? undefined :FREE_TODO_LIMIT

    }
    )
     const total = await prisma.todo.count({where:{userId:userId}})
     const hiddenCount = Math.max(0, total -todo.length)



    return NextResponse.json({ todo,hiddenCount, message: "todo found succesfully" }, { status: 200 })

  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ mesage: "database failed" }, { status: 500 })

  }
}
export async function POST(request: NextRequest) {
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
    const { title, description } = await request.json()
    if (!title) {

      return NextResponse.json({ message: "title is required" }, { status: 400 })
    }
     const FREE_TODO_LIMIT=3;

     const user= await prisma.user.findUnique({where:{id:userId}})
     const todoCount= await prisma.todo.count({where:{userId:userId}})
     
     
      if (!user?.isSubscribed && todoCount >= FREE_TODO_LIMIT) {
          return NextResponse.json({ message: "Your free limit is reached. Please subscribe." }, { status: 403 })

      }

    const createtodo = await prisma.todo.create({
      data: {
        title: title,
        description: description,
        user:{
          connectOrCreate:{
            where:{id:userId},
            create:{id:userId}
          }
        }

      }
    })

    return NextResponse.json({ data: createtodo, message: "todo is created successfully" }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "database failed" }, { status: 500 })

  }

}