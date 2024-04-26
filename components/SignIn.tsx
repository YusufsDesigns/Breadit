import Link from "next/link"
import { Icons } from "./Icon"
import UserAuthForm from "./UserAuthForm"


const SignIn = () => {
    return (
        <div className="container mx-auto flex flex-col justify-center sm:w-[400px]">
            <div className="flex flex-col space-y-6 text-center">
                <Icons.logo className="w-6 h-6 mx-auto" />
                <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
                <p className="max-w-xs mx-auto text-small">By continuing, you are setting up a Breadit account and agree to our User Agreement and Privacy Policy</p>

                <UserAuthForm />

                <p className="px-8 text-sm text-center text-muted-foreground">
                    New to Breadit?{' '}
                    <Link href='/sign-up' className="text-sm underline hover:text-zinc-800 underline-offset-4">Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default SignIn