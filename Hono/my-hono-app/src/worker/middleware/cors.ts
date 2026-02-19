import type { MiddlewareHandler } from "hono";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
];

export const cors: MiddlewareHandler = async (c, next) => {
  const origin = c.req.header("Origin") ?? "";

  const allowed =
    ALLOWED_ORIGINS.includes(origin) ||
    // Allow any *.workers.dev or *.pages.dev in production
    /^https:\/\/.*\.(workers\.dev|pages\.dev)$/.test(origin);

  const corsOrigin = allowed ? origin : ALLOWED_ORIGINS[0];

  // Handle preflight
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  await next();

  c.res.headers.set("Access-Control-Allow-Origin", corsOrigin);
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
};
