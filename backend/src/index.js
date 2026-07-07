import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { checkDbConnection } from "./db.js";
import { checkRedisConnection } from "./redis.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------------------------
// Health check: تست اتصال به دیتابیس و Redis
// این اندپوینت مهم‌ترین چیزیه که برای اطمینان از دیپلوی درست روی رانفلر لازم داریم
// ---------------------------------------------------------------------------
app.get("/api/health", async (req, res) => {
  const status = { server: "ok", db: null, redis: null };

  try {
    const dbResult = await checkDbConnection();
    status.db = dbResult.ok ? "ok" : "error";
  } catch (err) {
    status.db = "error";
    status.dbError = err.message;
  }

  try {
    const redisResult = await checkRedisConnection();
    status.redis = redisResult.ok ? "ok" : "error";
  } catch (err) {
    status.redis = "error";
    status.redisError = err.message;
  }

  const httpStatus = status.db === "ok" && status.redis === "ok" ? 200 : 500;
  res.status(httpStatus).json(status);
});

// ---------------------------------------------------------------------------
// HTTP + WebSocket server در یک پورت
// این تست مهم‌ترین ریسک دیپلوی روی رانفلر رو می‌سنجه: آیا WebSocket پشت
// پروکسی رانفلر بدون قطعی کار می‌کنه یا نه.
// ---------------------------------------------------------------------------
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" }, // در پروداکشن باید محدود به دامنه‌ی فرانت بشه
});

io.on("connection", (socket) => {
  console.log(`[socket] client connected: ${socket.id}`);

  socket.on("echo", (payload) => {
    socket.emit("echo:response", { received: payload, at: new Date().toISOString() });
  });

  socket.on("disconnect", () => {
    console.log(`[socket] client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});
