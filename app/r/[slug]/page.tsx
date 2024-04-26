import { auth } from "@/auth"
import MiniCreatePost from "@/components/MiniCreatePost"
import PostFeed from "@/components/PostFeed"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        slug: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { slug } = params

    const session = await auth()

    const subreddit = await db.subreddit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS
            }
        }
    })

    if(!subreddit) return notFound()

    return (
        <>
            <h1 className="text-3xl font-bold md:text-4xl h-14">
                r/{subreddit.name}
            </h1>
            <MiniCreatePost session={session} />
            <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
        </>
    )
}

export default Page