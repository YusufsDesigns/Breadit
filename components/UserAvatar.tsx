import { User } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Image from "next/image";
import { Icons } from "./Icon";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps{
    user: Pick<User, 'name' | 'image'>
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
    console.log(user);
    
    return (
        <Avatar {...props}>
            {user.image ? (
                <div className="relative w-full h-full aspect-square">
                    <Image 
                        src={user.image}
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                        fill
                    />
                </div>
            ):
                <AvatarFallback>
                    <span className="sr-only">{user.name}</span>
                    <Icons.user className="w-4 h-4" />
                </AvatarFallback>
            }
        </Avatar>

    )
}

export default UserAvatar