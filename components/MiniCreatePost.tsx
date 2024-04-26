"use client"

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import UserAvatar from "./UserAvatar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ImageIcon, Link2 } from "lucide-react"

interface Props{
    session: Session | null
}


const MiniCreatePost = ({ session }: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="overflow-hidden bg-white rounded-md shadow">
            <div className="flex justify-between h-full gap-6 px-6 py-4">
                <div className="relative">
                    <UserAvatar user={{
                        name: session?.user.name || null,
                        image: session?.user.image || null,
                    }} />

                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full outline outline-2 outline-white" />
                </div>

                <Input readOnly onClick={() => router.push(pathname + '/submit')} placeholder="Create Post" />
                <Button
                    onClick={() => router.push(pathname + '/submit')}
                    variant='ghost'
                >
                    <ImageIcon className="text-zinc-600" />
                </Button>
                <Button
                    onClick={() => router.push(pathname + '/submit')}
                    variant='ghost'
                >
                    <Link2 className="text-zinc-600" />
                </Button>
            </div>
        </div>
    )
}

export default MiniCreatePost