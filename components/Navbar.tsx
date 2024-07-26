import Link from "next/link"
import { Icons } from "./Icon"
import { buttonVariants } from "./ui/button"
import { UserAccountNav } from "./UserAccountNav"
import { auth } from "@/auth"
import SearchBar from "./SearchBar"


const Navbar = async () => {
    const session = await auth()
    return (
        <div className="fixed inset-x-0 top-0 border-b h-fit bg-zinc-100 border-zinc-300 z-[10] py-2">
            <div className="container px-4 flex items-center justify-between h-full gap-2 mx-auto max-w-7xl">
                <Link href='/' className="flex items-center gap-2">
                    <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
                    <p className="hidden text-sm font-medium text-zinc-700 md:block">Breadit</p>
                </Link>
                <SearchBar />
                {session?.user ? (
                    <UserAccountNav user={session.user} />
                ): 
                    <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>
                }
            </div>
        </div>
    )
}

export default Navbar