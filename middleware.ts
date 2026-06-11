import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Apenas rotas /admin/* (exceto /admin/login)
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Verifica se há cookie de sessão do Supabase
  // Os cookies do Supabase Auth têm nomes que começam com "sb-" + projectRef + "-auth-token"
  // Verificamos se QUALQUER cookie de auth existe
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some(
    (c) => c.name.includes('-auth-token') || c.name.startsWith('sb-'),
  );

  if (!hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
