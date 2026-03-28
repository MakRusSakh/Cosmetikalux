import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// NextAuth v5 config для CosmetikaLux
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        phone: {},
        password: {},
      },
      async authorize(credentials) {
        // Пока заглушка — проверяем захардкоженного админа
        // TODO: заменить на Prisma query когда БД подключена
        const phone = credentials?.phone as string
        const password = credentials?.password as string

        if (!phone || !password) return null

        // Demo admin для разработки
        if (phone === '+79001234567' && password === 'admin123') {
          return {
            id: 'admin-1',
            name: 'Администратор',
            phone,
            role: 'ADMIN',
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as Record<string, unknown>).role
        token.phone = (user as Record<string, unknown>).phone
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        ;(session.user as unknown as Record<string, unknown>).role = token.role
        ;(session.user as unknown as Record<string, unknown>).phone = token.phone
        ;(session.user as unknown as Record<string, unknown>).id = token.sub!
      }
      return session
    },
  },
})
