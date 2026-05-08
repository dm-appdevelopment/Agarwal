import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const PUBLIC_PATHS = ['/login', '/api/auth/login'];

// Pages that require specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/team':    ['Super Master','Admin','Team Lead'],
  '/audit':   ['Super Master','Admin'],
  '/settings':['Super Master','Admin'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files and Next internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('atpl_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    // Role-based route guard
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Attach user to request headers for API routes
    const headers = new Headers(req.headers);
    headers.set('x-user-id',   payload.id as string);
    headers.set('x-user-role', role);
    headers.set('x-user-name', payload.full_name as string);

    return NextResponse.next({ request: { headers } });
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('atpl_session');
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
