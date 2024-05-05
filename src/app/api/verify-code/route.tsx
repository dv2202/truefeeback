import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";   

export async function POST(request: Request) {
    await dbConnect();
    try{
        const {username,code} = await request.json();
        
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username:decodedUsername
        })

        if(!user){
            return Response.json({
                success: false,
                message: "usernmae not found"
            },{status: 500})
        }
        const isCodeValid = user.verifyCode === code ;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeExpired){
            user.isVerified = true;
            await user.save()
            return Response.json({
                success: true,
                message: "Code verified successfully"
            },{status: 200})
        } else if(!isCodeExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired please signup again to get a new code"
            },{status: 400})
        } else{
            return Response.json({
                success: false,
                message: "Invalid code "
            },{status: 400}
            )
        }

    }
    catch(error){
        console.log("Error in verify-code route: ", error)
        return Response.json({
            success: false,
            message: "Error verifying code"
        },{status: 500})
    }
}