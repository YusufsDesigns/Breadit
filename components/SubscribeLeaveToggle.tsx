"use client"

import { useMutation } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { startTransition } from "react"

interface SubscribeLeaveToggleProps{
    subredditId: string
    subredditName: string
    isSubscribed: boolean
}


const SubscribeLeaveToggle = ({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) => {
    const { loginToast } = useCustomToast()
    const { toast } = useToast()
    const router = useRouter()

    const { mutate: subscribe, isPending: isSubscribing } = useMutation({
        mutationFn: async() => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }

            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return loginToast()
                }
                if(err.response?.status === 400){
                    return toast({
                        title: "There was a problem",
                        description: "You are already subscribed to this subreddit",
                        variant: "destructive",
                    })
                }
            }

            return toast({
                title: "There was a problem ",
                description: "Something went wrong, please try again",
                variant: "destructive",
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: "Subscribed",
                description: `You are successfully subscribed to r/${subredditName}`
            })
        }
    })

    const { mutate: unsubscribe, isPending: isUnsubscribing } = useMutation({
        mutationFn: async() => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }

            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return loginToast()
                }
                if(err.response?.status === 400){
                    return toast({
                        title: "There was a problem",
                        description: "You are not subscribed to this subreddit",
                        variant: "destructive",
                    })
                }
            }

            return toast({
                title: "There was a problem ",
                description: "Something went wrong, please try again",
                variant: "destructive",
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: "Unsubscribed",
                description: `You have successfully unsubscribed from r/${subredditName}`,
            })
        }
    })

    return isSubscribed ? (
        <Button className="w-full mt-1 mb-4" onClick={() => unsubscribe()} isLoading={isUnsubscribing}>Leave community</Button>
    ) : (
        <Button className="w-full mt-1 mb-4" onClick={() => subscribe()} isLoading={isSubscribing}>Join to post</Button>
    )
}

export default SubscribeLeaveToggle