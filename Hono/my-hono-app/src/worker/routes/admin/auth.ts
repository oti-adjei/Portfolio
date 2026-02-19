import { Hono } from "hono";
import { signJwt } from "../../middleware/auth.js";

const authRoutes = new Hono<{ Bindings: Env }>();

// POST /api/admin/auth/login
authRoutes.post("/login", async (c) => {
  let body: { email?: string; password?: string };
  try {
    body = await c.req.json<{ email?: string; password?: string }>();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const { email, password } = body;

  if (
    !email ||
    !password ||
    email !== c.env.ADMIN_EMAIL ||
    password !== c.env.ADMIN_PASSWORD
  ) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await signJwt(
    {
      sub: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    },
    c.env.JWT_SECRET
  );

  return c.json({ token });
});

export default authRoutes;
