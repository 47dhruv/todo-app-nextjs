import crypto from "crypto"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hasActiveSubscription } from "@/lib/subscription"

export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated || !userId) {
      return NextResponse.json({ message: "user is not authenticated" }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()
    const values = [razorpay_order_id, razorpay_payment_id, razorpay_signature]
    if (values.some((v) => typeof v !== "string" || v.length === 0)) {
      return NextResponse.json({ message: "payment details are missing" }, { status: 400 })
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    const a = Buffer.from(expected, "hex")
    const b = Buffer.from(razorpay_signature, "hex")
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ message: "invalid payment signature" }, { status: 400 })
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId: razorpay_order_id, userId: userId },
    })
    if (!payment) {
      return NextResponse.json({ message: "payment not found" }, { status: 404 })
    }
    if (payment.status === "PAID") {
      return NextResponse.json({ message: "payment already verified" }, { status: 200 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const start = hasActiveSubscription(user) ? user!.subscribedUntil! : new Date()
    const subscribedUntil = new Date(start)
    subscribedUntil.setFullYear(subscribedUntil.getFullYear() + 1)

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", paymentId: razorpay_payment_id, paidAt: new Date() },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { subscribedUntil: subscribedUntil },
      }),
    ])

    return NextResponse.json({ message: "subscription active", subscribedUntil }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "could not verify payment" }, { status: 500 })
  }
}