import { auth } from "@/auth"
import { Post, User, Vote, VoteType } from "@prisma/client"
import { notFound } from "next/navigation"
import PostVoteClient from "./PostVoteClient"


interface PostVoteServerProps{
    postId: string
    initialVotesAmt?: number
    initialVoteType?: VoteType | null
    getData?: () => Promise<(Post & { votes: Vote[], author: User }) | null>
}

const PostVoteServer = async ({
    postId,
    initialVotesAmt,
    initialVoteType,
    getData
}: PostVoteServerProps) => {

    const session = await auth()

    let _voteAmt: number = 0
    let _currentVote: VoteType | null | undefined = undefined

    if(getData){
        const post = await getData()
        if(!post) return notFound()

        _voteAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)

        _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
    } else{
        _voteAmt = initialVotesAmt!
        _currentVote = initialVoteType
    }

    return <PostVoteClient postId={postId} initialVotesAmt={_voteAmt} initialVote={initialVoteType} />
}

export default PostVoteServer