import UserModel from "@/models/user";
import dbConnect from "@/server/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
    try {
        dbConnect()

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const session = await getServerSession(authOptions)

        if(!session || !session.user) {
            return NextResponse.json({
                success: false,
                messaage: 'Unauthorized access'
            }, {status: 400})
        }

        const user = await UserModel.findById(userId)

        if(!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, {status: 500})
        }

        return NextResponse.json({
            success: true,
            message: 'Names Acquired',
            name: `${user.firstName} ${user.lastName}`,
        })
    } catch (error) {
        console.log('Error geting name', error)
        return NextResponse.json({
            success: false,
            message: 'Error getting name'
        }, {status: 400})
    }
}