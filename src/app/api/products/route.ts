import { prisma } from "@/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const categories = searchParams.get("cat")
    try {
        const products = await prisma.product.findMany({
            where: {
                ...(categories ? { catSlug: categories } : { isFeatured: true }),
            }
        })
        return new NextResponse(JSON.stringify(products), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}