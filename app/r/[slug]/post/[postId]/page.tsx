import CommentsSection from "@/components/CommentsSection"
import EditorOutput from "@/components/EditorOutput"
import PostVoteServer from "@/components/post-vote/PostVoteServer"
import { buttonVariants } from "@/components/ui/button"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigUp, Loader2, ArrowBigDown } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"


interface pageProps{
    params: {
        postId: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params: { postId } }: pageProps) => {
    const cachedPost = await redis.hgetall(`post:${postId}`) as CachedPost

    let post: (Post & { votes: Vote[], author: User }) | null = null

    if(!cachedPost){
        post = await db.post.findFirst({
            where: {
                id: postId
            },
            include: {
                votes: true,
                author: true
            }
        })
    }

    if(!post && !cachedPost) return notFound()

    return (
        <div>
          <div className="flex justify-between h-full">
            <div className='flex-1 w-full p-4 bg-white rounded-sm sm:w-0'>
              <div className="flex">
                <Suspense fallback={<PostVoteShell />}>
                  <PostVoteServer 
                    postId={post?.id ?? cachedPost.id} 
                    getData={async () => {
                      return await db.post.findUnique({
                        where: {
                          id: postId,
                        },
                        include: {
                          votes: true,
                          author: true
                        },
                      })
                    }}
                  />
                </Suspense>
                  <div className="flex-1">
                    <p className='mt-1 text-xs text-gray-500 truncate max-h-40'>
                      Posted by u/{post?.author.name ?? ''}{' '}
                      {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                    </p>
                    <h1 className='py-2 text-xl font-semibold leading-6 text-gray-900'>
                      {post?.title ?? cachedPost.title}
                    </h1>

                    <EditorOutput content={post?.content ?? cachedPost.content} />
                  </div>
              </div>
              
              <Suspense
                fallback={
                  <Loader2 className='w-5 h-5 animate-spin text-zinc-500' />
                }>
                <CommentsSection postId={post?.id ?? cachedPost.id} />
              </Suspense>
            </div>
          </div>
        </div>
    )
}


function PostVoteShell() {
  return (
    <div className='flex flex-col items-center w-20 pr-6'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='w-5 h-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='py-2 text-sm font-medium text-center text-zinc-900'>
        <Loader2 className='w-3 h-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='w-5 h-5 text-zinc-700' />
      </div>
    </div>
  )
}


export default page