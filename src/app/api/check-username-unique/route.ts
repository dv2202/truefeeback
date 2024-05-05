import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schema/signUpSchema";

const UsernameQuerySchema  = z.object({
    username: usernameValidation

})

export async function GET(request: Request){
    await dbConnect();
    try{
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')

        }

        //validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid username"
            },{status: 400})
        }
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({username,isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username already exists"
            },{status: 400})
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        },{status: 400})
    }
    catch(error){
        console.log("Error in check-username-unique route: ", error)
        return Response.json({
            success: false,
            message: "Error checking username "
        },{status: 500})
    }
}