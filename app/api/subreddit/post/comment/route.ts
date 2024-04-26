import { auth } from "@/auth";
import { db } from "@/lib/db";
import { commentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await auth()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { postId, text, replyToId } = commentValidator.parse(body)

        await db.comment.create({
            data: {
                text,
                postId,
                authorId: session.user.id,
                replyToId
            }
        })

        return new Response('OK')

    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create comment', { status: 500 })
    }
}