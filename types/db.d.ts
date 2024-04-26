import { Comment, CommentVote, Post, Subreddit, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    subreddit: Subreddit
    votes: Vote[]
    author: User
    comments: Comment[]
}

export type ExtendedComment = Comment & {
    author: User
    votes: CommentVote[]
    replies: Comment[]
}