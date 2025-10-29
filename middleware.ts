import { NextResponse } from 'next/server'
import { auth } from '@/auth'


export const runtime = 'nodejs'

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const { user } = req.auth || {};

    if (pathname.startsWith('/admin')) {
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
})

export const config = {
    matcher: ['/admin/:path*'],
}

