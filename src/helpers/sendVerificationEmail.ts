import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponce } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string, 
    username: string, 
    verifyCode: string
    ): Promise<ApiResponce> {
        try{
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'TrueFeedback | Verification code',
                react: VerificationEmail({username,otp:verifyCode}),
              });
            return{success:true, message: "Verification email send successfully"}
        }
        catch(emailError){
            console.log("Error Sending Verification email", emailError)
            return{success:false, message: "Error Sending Verification email"}
        }
    }
