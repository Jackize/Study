import { getAuthSession } from "@/utils/constant";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {
  const session = await getAuthSession()
  if (session) {
    try {
      if (session.user.isAdmin) {
        const orders = await prisma.order.findMany()
        return new NextResponse(JSON.stringify(orders), { status: 200 })
      }
      const orders = await prisma.order.findMany({
        where: {
          userEmail: session.user.email!
        }
      })
      return new NextResponse(JSON.stringify(orders), { status: 200 })
    } catch (error) {
      console.log(error);
      return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
  } else {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
  }
}

export const POST = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (session) {
    try {
      const body = await req.json();
      const order = await prisma.order.create({
        data: body,
      });
      return new NextResponse(JSON.stringify(order), { status: 201 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "You are not authenticated!" }),
      { status: 401 }
    );
  }
};