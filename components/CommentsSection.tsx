import { auth } from "@/auth"
import { db } from "@/lib/db"
import PostComment from "./PostComment"
import CreateComment from "./CreateComment"

interface commentsSectionProps{
    postId: string
}

const CommentsSection = async ({ postId }: commentsSectionProps) => {

    const session = await auth()

    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true
                }
            }
        }
    })

    return (
        <div className="flex flex-col mt-4 gap-y-4">
            <hr className="w-full h-px my-6" />

            <CreateComment postId={postId} />

            <div className="flex flex-col mt-4 gap-y-6">
                {comments.filter((comment) => !comment.replyToId).map((topLevelComment) => {

                    const topLevelCommentVoteAmt = topLevelComment.votes.reduce((acc, vote) => {
                        if (vote.type === 'UP') return acc + 1
                        if (vote.type === 'DOWN') return acc - 1
                        return acc
                    }, 0)

                    const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id)

                    return( 
                        <div key={topLevelComment.id} className="flex flex-col">
                            <div className="mb-2">
                                <PostComment 
                                    comment={topLevelComment} 
                                    votesAmt={topLevelCommentVoteAmt} 
                                    currentVote={topLevelCommentVote}
                                    postId={postId}
                                />
                            </div>
                            {topLevelComment.replies.sort(
                                (a, b) => b.votes.length - a.votes.length
                                ).map((reply) => {
                                    const replyVoteAmt = reply.votes.reduce((acc, vote) => {
                                        if (vote.type === 'UP') return acc + 1
                                        if (vote.type === 'DOWN') return acc - 1
                                        return acc
                                    }, 0)
                
                                    const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)

                                    return( 
                                        <div key={reply.id} className="py-2 pl-4 ml-2 border-l-2 border-zinc-200">
                                            <PostComment comment={reply} currentVote={replyVote} votesAmt={replyVoteAmt} postId={postId} />
                                        </div>
                                    )
                                })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CommentsSection