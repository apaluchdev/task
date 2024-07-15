export { default } from "next-auth/middleware";

// Match all requests except for the ones that start with /api/auth, /_next/static, /_next/image, and /favicon.ico
export const config = { matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"] };
