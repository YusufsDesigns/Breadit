import { formatTimeToNow } from "@/lib/utils"
import type { Post, User, Vote } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./post-vote/PostVoteClient"

type PartialVote = Pick<Vote, 'type'>

interface PostProps{
  subredditName: string
  post: Post & {
    votes: Vote[]
    author: User
  }
  commentAmt: number
  voteAmt: number
  currentVote: PartialVote
}


const Post = ({ subredditName, post, commentAmt, voteAmt, currentVote }: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null)
    return (
        <div className='bg-white rounded-md shadow'>
      <div className='flex justify-between px-2 sm:px-6 py-4'>
        {/* TODO */}
        <PostVoteClient  postId={post.id} initialVote={currentVote?.type} initialVotesAmt={voteAmt} />

        <div className='flex-1 w-0'>
          <div className='mt-1 text-xs text-gray-500 max-h-40'>
            {subredditName ? (
              <>
                <a
                  className='text-sm underline text-zinc-900 underline-offset-2'
                  href={`/r/${subredditName}`}>
                  r/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='py-2 text-lg font-semibold leading-6 text-gray-900'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative w-full text-sm max-h-40 overflow-clip'
            ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </div>
        </div>
      </div>

      <div className='z-20 px-4 py-4 text-sm bg-gray-50 sm:px-6'>
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className='flex items-center gap-2 w-fit'>
          <MessageSquare className='w-4 h-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
    )
}

export default Post