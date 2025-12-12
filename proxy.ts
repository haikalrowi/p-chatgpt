import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ja"],
  defaultLocale: "en",
});

export function proxy(request: NextRequest) {
  const response = I18nMiddleware(request);
  const locale = response.cookies.get("Next-Locale")?.value;
  if (locale) {
    response.cookies.set("Next-Locale", locale, { sameSite: false });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
