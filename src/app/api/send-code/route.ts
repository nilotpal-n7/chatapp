import { sendVerificationEmail } from '@/lib/sendVerificationEmail'
import UserModel from '@/models/user'
import dbConnect from '@/server/db'

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { email } = await request.json()
        const user = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date(Date.now() + 3600000)

        if(!user) {
            console.log('user not found')
            return Response.json({
                success: false,
                message: 'User not found'
            })
        }
        user.verifyCode = verifyCode
        user.verifyCodeExpiry = expiryDate
        await user.save()

        const emailResponse = await sendVerificationEmail(
            `${user?.firstName} ${user?.lastName}`,
            email,
            verifyCode,
            expiryDate,
        )
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        } else {
            return Response.json({
                success: true,
                message: "Email sent successfully, please verify your email"
            }, {status: 201})
        }

    } catch (error) {
        console.error('Error sending email', error)
        return Response.json({
                success: false,
                message: "Error sending email"
        }, {status: 500})
    }
}
