import UserModel from "@/models/user";
import dbConnect from "@/server/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const { firstName, lastName, email, password } = await req.json()

        const user = await UserModel.findOne({email})
        if(user) {
            return Response.json({
                success: false,
                message: 'User already exist',
            }, {status: 400})
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const hassedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date(Date.now() + 3600000)

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hassedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate
        })

        await newUser.save()
        return Response.json({
            success: true,
            message: "User registered successfully, please verify your email"
        }, {status: 201})

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {status: 500})
    }
}
