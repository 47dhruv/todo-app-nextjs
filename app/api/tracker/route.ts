import prisma from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export  async function GET(request:NextRequest) {
    
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
  
          const params= request.nextUrl.searchParams
          const names=["today","week","month","year"]
          const starts:Record<string,Date>={}
  
          for (const name of names) {
              const date=new Date(params.get(name)??NaN)
              if (Number.isNaN(date.getDate())) {
          return NextResponse.json({ message: `${name} must be a valid date` }, { status: 400 })
  
          }
          starts[name]=date
        }
  
          const [today, week, month, year] = await Promise.all(
        names.map((name) =>
          prisma.todo.count({
            where: { userId: userId, completedAt: { gte: starts[name] } },
          })
        )
      )
  
       
          return NextResponse.json({ today, week, month, year }, { status: 200 })
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "database failed" }, { status: 500 })
  }
}


