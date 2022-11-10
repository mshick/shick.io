import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account?.access_token
        }
      }

      return token
    },
    session({ session, user, token }) {
      return {
        ...session,
        accessToken: token.accessToken
      }
    }
  }
}

const handler: NextApiHandler = async (req, res) => {
  return await NextAuth(authOptions)(req, res)
}

export default handler
