import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { YEARLY_PRICE_PAISE, CURRENCY } from "@/lib/constants";
import prisma from "@/lib/prisma"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.slice(0, 9), !!process.env.RAZORPAY_KEY_SECRET)
    const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated) {
      return NextResponse.json({ message: "user is not authenticated" }, { status: 401 })
    }
    if (!userId) {
      return NextResponse.json({ message: "user id not found" }, { status: 404 })
    }

    const order = await razorpay.orders.create({
      amount: YEARLY_PRICE_PAISE,
      currency: CURRENCY,
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: userId },

    })
    await prisma.payment.create({
  data: {
    orderId: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    user: {
      connectOrCreate: {
        where: { id: userId },
        create: { id:userId },
      },
    },
  },
})

    return NextResponse.json(
      { orderId: order.id, amount: order.amount, currency: order.currency },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "could not create order" }, { status: 500 })
  }
}