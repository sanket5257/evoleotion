import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }
      })
    ],
    callbacks: {
      session: async ({ session, token }) => {
        if (session?.user && token?.sub) {
          session.user.id = token.sub
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          })
          session.user.role = user?.role || 'USER'
        }
        return session
      },
      jwt: async ({ user, token }) => {
        if (user) {
          token.uid = user.id
          token.role = user.role
        }
        return token
      },
    },
    session: {
      strategy: 'jwt',
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
}

// For backward compatibility, export the function result
export const authOptions = getAuthOptions()

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: string
    }
  }
  
  interface User {
    role: string
  }
}