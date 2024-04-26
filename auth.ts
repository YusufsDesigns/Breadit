import NextAuth from "next-auth"

import Google from "next-auth/providers/google"
import { nanoid } from 'nanoid'

import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"

export const config = {
  adapter: PrismaAdapter(db),
  providers: [
    Google
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.image = token.picture
        session.user.username = token.username
      }

      return session
    },

    async jwt({ token, user }) {
      if(!token.sub) return token
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        token.sub = user.id
        return token
      }

      if (dbUser.username === null || dbUser.username === undefined) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        })
      }

      return token
    },
    redirect() {
      return '/'
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
