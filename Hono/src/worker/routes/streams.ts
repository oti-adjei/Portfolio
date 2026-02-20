import { Hono } from "hono";
import { type StreamEventRow, rowToStreamEvent } from "../types.js";

const streams = new Hono<{ Bindings: Env }>();

// GET /api/streams
streams.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM stream_events ORDER BY date ASC, time ASC"
  ).all<StreamEventRow>();
  return c.json(results.map(rowToStreamEvent));
});

export default streams;
