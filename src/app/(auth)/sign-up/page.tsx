'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as z  from "zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {useDebounceCallback, useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { signUpSchema } from "@/schema/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponce } from "@/types/ApiResponse"
import { Form,FormField,FormLabel,FormMessage,FormItem, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername,300)
  const {toast} = useToast()
  const router = useRouter()

  //zod implementation 
  const form  = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:'',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async ()=> {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponce>
          setUsernameMessage(
            axiosError?.response?.data.message ?? "Error checking username"
          )
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

   const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)
      try {
        const response = await axios.post<ApiResponce>('/api/sign-up',data)
        toast({
          title: 'Success',
          description: response.data.message, 
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch (error) {
          console.log("error un signup of user",error)
          const axiosError = error as AxiosError<ApiResponce>
          toast({
            title: 'Error',
            description: axiosError?.response?.data.message ?? "Error signing up",
            variant:"destructive"
          })
      }finally{
        setIsSubmitting(false)
      }
   }


return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign un to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                    }}/>
                    </FormControl>
                  {
                    isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin" />
                  }
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    test {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input {...field}  />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit" disabled={isSubmitting}>{
              isSubmitting ? (
              <>
              <Loader2 className= "mr-2 h-4 w-4 animate-spin">Please Wait</Loader2>
              </>
              ) : ("Sign In")
            
            }</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member ?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage
