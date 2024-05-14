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
import { signInSchema } from "@/schema/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {


  const {toast} = useToast()
  const router = useRouter()

  //zod implementation 
  const form  = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:'',
    }
  })


   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })
      if(result?.error){
        if(result.error === "CredentialsSignin") {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect",
            variant: "destructive",
          })
        }else{
          toast({
            title: "Invalid Credentials",
            description: result.error,
            variant: "destructive",
          })
        
        }
      }
      if(result?.url){
        router.replace('/dashboard')
      }
   }


return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Email/Username" {...field}  />
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
                        <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit" >
                Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page
