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

        const users = await User.find({
          email: { $regex: query, $options: 'i' },
        }).select('_id email firstName lastName');

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
