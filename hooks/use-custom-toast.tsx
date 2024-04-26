import React from 'react'
import { toast } from './use-toast'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export const useCustomToast = () => {
    const loginToast = () => {
        const { dismiss } = toast({
            title: 'Login required',
            description: 'You need to login to do that.',
            variant: 'destructive',
            action: (
                <Link 
                    href='/sign-in'
                    onClick={() => dismiss()}
                    className={buttonVariants({ variant: 'secondary' })}
                >
                    Login
                </Link>
            )
        })
    }
    return { loginToast }
}
