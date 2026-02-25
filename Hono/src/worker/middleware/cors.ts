import type { MiddlewareHandler } from "hono";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
];

function normalizeOrigin(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

function parseEnvAllowedOrigins(env: unknown): string[] {
  const raw = (env as { CORS_ALLOWED_ORIGINS?: string } | undefined)?.CORS_ALLOWED_ORIGINS;
  if (!raw) return [];

  return raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

export const cors: MiddlewareHandler = async (c, next) => {
  const origin = c.req.header("Origin") ?? "";
  const allowedOrigins = [...DEFAULT_ALLOWED_ORIGINS, ...parseEnvAllowedOrigins(c.env)];

  const allowed =
    allowedOrigins.includes(origin) ||
    // Allow any *.workers.dev or *.pages.dev in production
    /^https:\/\/.*\.(workers\.dev|pages\.dev)$/.test(origin);

  const corsOrigin = allowed ? origin : DEFAULT_ALLOWED_ORIGINS[0];

  // Handle preflight
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
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
  c.res.headers.set("Vary", "Origin");
};
