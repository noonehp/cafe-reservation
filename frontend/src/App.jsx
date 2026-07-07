import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState(null);
  const [socketStatus, setSocketStatus] = useState("در حال اتصال...");
  const [echoResponse, setEchoResponse] = useState(null);

  // تست اتصال REST به بک‌اند
  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setHealthError(err.message));
  }, []);

  // تست اتصال WebSocket به بک‌اند
  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      setSocketStatus("متصل ✅");
      socket.emit("echo", { message: "سلام از فرانت‌اند" });
    });

    socket.on("echo:response", (data) => {
      setEchoResponse(data);
    });

    socket.on("disconnect", () => {
      setSocketStatus("قطع شد ❌");
    });

    socket.on("connect_error", (err) => {
      setSocketStatus(`خطا در اتصال: ${err.message}`);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", direction: "rtl" }}>
      <h1>تست اسکلت پروژه‌ی رزرو کافه</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>۱. وضعیت بک‌اند (REST) — {API_URL}</h2>
        {healthError && <p style={{ color: "red" }}>خطا: {healthError}</p>}
        {health && (
          <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
            {JSON.stringify(health, null, 2)}
          </pre>
        )}
        {!health && !healthError && <p>در حال بررسی...</p>}
      </section>

      <section>
        <h2>۲. وضعیت WebSocket</h2>
        <p>وضعیت اتصال: {socketStatus}</p>
        {echoResponse && (
          <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
            {JSON.stringify(echoResponse, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
