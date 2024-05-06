import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';   
import { User } from 'next-auth';

export async function POST(request: Request) {
    dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "not authenticated"
        },
        {status: 401})
    }

    const userId = user._id 
    const {acceptMessages} = await request.json();

    try{
        const updatedUser = await UserModel.findOneAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true},
        )
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update status of user to accept messages"
            },
            {status: 404})
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        },
        {status: 200})
    }catch(error){
        console.log("Failed to update status of user to accept messages ")
        return Response.json({
            success: false,
            message: "Failed to update status of user to accept messages"
        },
        {status: 500})
    }

}

export async function GET(request: Request){
    dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "not authenticated"
        },
        {status: 401})
    }

    const userId = user._id 
    try {
            const foundUser = await UserModel.findById(userId)
            if(!foundUser){
                return Response.json({
                    success: false,
                    message: "User not found"
                },
                {status: 404})
            }
            return Response.json({
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            {status: 200})
    } catch (error) {
        console.log("Failed to get status of user to accept messages ")
        return Response.json({
            success: false,
            message: "Failed to get status of user to accept messages"
        },
        {status: 500})
    }
}

