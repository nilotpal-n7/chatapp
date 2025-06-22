import dbConnect from "@/server/db"
import UserModel from "@/models/user"
import bcrypt from "bcryptjs"
import { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type CredentialsType = {
    email: string;
    password: string;
    code: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'Email'},
                password: {label: 'Password', type: 'password', placeholder: 'Password'},
                code: {label: 'Code', type: 'password', placeholder: 'Code'},
            },
            async authorize(credentials): Promise<User> {
                await dbConnect()

                try {
                    if(!credentials) {
                        throw new Error("Missing credentials")
                    }
                    const { email, password, code } = credentials as CredentialsType

                    const user = await UserModel.findOne({
                        email: email,
                    })

                    if(!user) {
                        throw new Error("User not found.")
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password)
                    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date()
                    const isCodeCorrect = code === user.verifyCode

                    if(!isPasswordCorrect) {
                        throw new Error("Password is incorrect.")
                    } else if(isCodeExpired) {
                        throw new Error('Code has expired.')
                    } else if(!isCodeCorrect) {
                        throw new Error("Code didn't match")
                    } else {
                        const {password, verifyCode, verifyCodeExpiry, ...safeUser} = user.toObject()
                        return safeUser as User
                    }

                } catch (error: any) {
                    console.error("Authorization error:", error)
                    
                    if(error instanceof Error) {
                        throw error
                    } else {
                        throw new Error("An unexpected error occured during authorization")
                    }
                }
            }
        }),
    ],

    callbacks: {
        async jwt({token, user}: {
            token: JWT;
            user?: User;
        }) {
            if(user) {
                token._id = user._id?.toString()
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.email = user.email
            }
            return token
        },
        async session({session, token}: {
            session: Session;
            token: JWT;
        }) {
            if(token) {
                session.user._id = token._id
                session.user.firstName = token.firstName
                session.user.lastName = token.lastName
                session.user.email = token.email
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}
