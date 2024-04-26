import { auth } from "@/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"

export async function PATCH(req: Request){
    try {
        const body = await req.json()

        const { commentId, type } = CommentVoteValidator.parse(body)

        const session = await auth()

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 })
        }

        const existingVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        })


        if(existingVote){
            if(existingVote.type === type){
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            userId: session.user.id,
                            commentId
                        }
                    }
                })
            }

            await db.commentVote.update({
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId
                    }
                },
                data: {
                    type: type
                }
            })

            return new Response('OK')
        }

        await db.commentVote.create({
            data: {
                type: type,
                userId: session.user.id,
                commentId
            }
        })

        return new Response('OK')
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid request data passed', { status: 422 })
        }

        return new Response('Could not register your vote, please try again.', { status: 500 })
    }
}