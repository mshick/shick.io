import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

if (!clientId || !clientSecret) {
  throw new Error('client credentials are required')
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  session: {
    maxAge: 7.5 * 60 * 60 // Needs to be less than GitHub
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token
        }
      }

      return token
    },
    session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        error: token.error
      }
    }
  }
}

const handler: NextApiHandler = async (req, res) => {
  return await NextAuth(authOptions)(req, res)
}

export default handler
