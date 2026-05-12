import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Якщо accessToken відсутній
  if (!accessToken) {
    // Але є refreshToken — пробуємо продовжити сесію
    if (refreshToken) {
      try {
        const data = await checkServerSession();

        const setCookie = data.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            // parse() не парсить атрибути Set-Cookie
            // тому встановлюємо лише значення cookie

            if (parsed.accessToken) {
              cookieStore.set("accessToken", parsed.accessToken);
            }

            if (parsed.refreshToken) {
              cookieStore.set("refreshToken", parsed.refreshToken);
            }
          }

          // Якщо користувач уже авторизований —
          // не даємо доступ до auth-сторінок
          if (isPublicRoute) {
            return NextResponse.redirect(new URL("/", request.url), {
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }

          // Для приватних маршрутів — дозволяємо доступ
          if (isPrivateRoute) {
            return NextResponse.next({
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
        }
      } catch (error) {
        console.error("Session refresh failed:", error);
      }
    }

    // Якщо сесії немає — дозволяємо доступ до публічних сторінок
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Для приватних — редірект на sign-in
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Якщо accessToken існує

  // auth-сторінки недоступні для авторизованих користувачів
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // приватні сторінки доступні
  if (isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up", "/notes/:path*"],
};