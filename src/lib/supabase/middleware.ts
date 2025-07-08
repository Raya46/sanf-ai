import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export const updateSession = async (request: NextRequest, env?: Env) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Get Supabase credentials from either process.env or Cloudflare Workers env
    const supabaseUrl =
      env?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey =
      env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const user = await supabase.auth.getUser();

    // protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && user.error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (error) {
    console.log("Supabase client could not be created:", error);

    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};