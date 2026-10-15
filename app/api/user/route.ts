import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";


export async function GET() {
    
    try {
       
        const todo= await prisma.todo.findMany() 
        return NextResponse.json(
            { 
                todo, message: "todo found successfully" 
            },
            {
                 status: 200 
            }
            )
    } catch (error) {
       console.log(error)
    return NextResponse.json(
        { 
            message: "database failed" 
        },
        { status: 500 

        }
    )
  }
 
    
}