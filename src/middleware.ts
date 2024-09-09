import { NextRequest, NextResponse } from 'next/server'

import {
  accessTokenRefresh,
  isAuthPages,
  isSecuredPage,
  isTokenValid,
} from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { cookies, nextUrl, url } = request
  const accessToken = cookies.get('accessToken')?.value ?? null
  const sessionId = cookies.get('sessionId')?.value ?? null

  const hasVerifiedToken = accessToken && isTokenValid(accessToken)
  const isAuthPageRequested = isAuthPages(nextUrl.pathname)
  const isSecuredPageRequested = isSecuredPage(nextUrl.pathname)

  if (isAuthPageRequested) {
    if (hasVerifiedToken) {
      return NextResponse.redirect(new URL('/', url))
    }

    return NextResponse.next()
  }

  if (isSecuredPageRequested) {
    if (hasVerifiedToken) {
      return NextResponse.next()
    }

    if (sessionId) {
      const id = sessionId.split('_')[1]
      const refreshResult = await accessTokenRefresh(id)

      if (refreshResult.success && refreshResult.accessToken) {
        const response = NextResponse.next()
        response.cookies.set('accessToken', refreshResult.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 15 * 60,
        })

        return response
      }
    }

    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
