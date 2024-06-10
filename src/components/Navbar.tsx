"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'


const Navbar = () => {
    const {data: session} = useSession()
    const user: User = session?.user as User
    console.log(user)
  return (
    <nav className='p-2 md:p-4 shadow-md'>
        <div className='container mx-auto flex flex-row md:flex-row text-center justify-between items-center'>
            <a className='text-xl font-bold md:mb-0 text-center m-0' href="#">True Feedback</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>
                        Welcome, {user?.username || user?.email}
                    </span>
                    <Button className='w-full md:w-auto' onClick={()=> signOut}>Logout</Button>
                </>
                ) : (
                    <div className='flex gap-5'>
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>Login</Button>
                    </Link>
                    <Link  href='/sign-up'>
                        <Button className='w-full md:w-auto'>SignUp</Button>
                    </Link>
                    </div>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar
