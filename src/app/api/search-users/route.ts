// /app/api/search-users/route.ts
import dbConnect from '@/server/db';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json({
                success: false,
                message: 'Error searching users: Missing query',
            }, { status: 400 });
        }

        const users = await User.aggregate([
          {
            $addFields: {
              fullNameWithSpace: { $concat: ['$firstName', ' ', '$lastName'] },
              fullNameNoSpace: { $concat: ['$firstName', '$lastName'] },
            },
          },
          {
            $match: {
              $or: [
                { email: { $regex: query, $options: 'i' } },
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { fullNameWithSpace: { $regex: query, $options: 'i' } },
                { fullNameNoSpace: { $regex: query, $options: 'i' } },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              email: 1,
              firstName: 1,
              lastName: 1,
            },
          },
        ]);

        return NextResponse.json({
            success: true,
            message: 'Users fetched',
            users: users,
        });

    } catch (error) {
        console.log('Error getting users', error)
        return NextResponse.json({
            success: false,
            message: 'Error getting users',
        });
    }
}
