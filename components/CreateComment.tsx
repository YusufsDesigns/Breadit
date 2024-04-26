"use client"

import { useState } from "react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"


interface CreateCommentProps{
    postId: string
    replyToId?: string
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
    const [input, setInput] = useState('')
    const { loginToast } = useCustomToast()
    const { toast } = useToast()
    const router = useRouter()

    const { mutate: comment, isPending } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }

            const { data } = await axios.patch('/api/subreddit/post/comment', payload)
            return data
        },
        onError: (err, voteType) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong',
                description: 'Your vote was not registered, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            router.refresh()
            setInput('')
        }
    })

    return (
        <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
                <Textarea 
                    id="comment" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    rows={1} 
                    placeholder="What are your thoughts" 
                />

                <div className="flex justify-end mt-2">
                    <Button 
                        isLoading={isPending} 
                        onClick={() => comment({postId, text:input, replyToId})} 
                        disabled={input.length === 0}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateComment