# سایت رزرو کافه — اسکلت اولیه (Walking Skeleton)

این نسخه فقط یک اسکلت تست‌شده‌ست، هدفش اطمینان از کارکردِ زنجیره‌ی کامل قبل از شروع پیاده‌سازی فیچرهای اصلی (طبق اسپک v3.0) هست:

```
فرانت‌اند (React) → بک‌اند (Express) → PostgreSQL + Redis
                          ↕
                     WebSocket (Socket.io)
```

## اجرای لوکال (با Docker)

پیش‌نیاز: Docker و Docker Compose نصب باشه.

```bash
docker compose up --build
```

بعد از بالا اومدن:
- بک‌اند: http://localhost:4000/api/health
- فرانت‌اند: http://localhost:4173

اگه توی صفحه‌ی فرانت، هم بخش "وضعیت بک‌اند" سبز/ok بود و هم "وضعیت WebSocket" نوشت "متصل ✅" و یک echo response نشون داد، یعنی کل زنجیره سالمه.

## اجرای لوکال (بدون Docker، برای توسعه‌ی سریع‌تر)

نیاز به PostgreSQL و Redis روی سیستم یا از طریق Docker فقط برای این دو تا:

```bash
docker compose up postgres redis
```

بک‌اند:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

فرانت‌اند:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## مرحله‌ی بعدی: دیپلوی روی رانفلر

1. توی رانفلر یه سرویس جدید از نوع **Docker** برای بک‌اند بساز، و Dockerfile داخل پوشه‌ی `backend/` رو معرفی کن.
2. یه سرویس Docker دیگه برای فرانت‌اند از پوشه‌ی `frontend/` — و متغیر build-time به اسم `VITE_API_URL` رو به آدرس عمومی بک‌اند (بعد از دیپلوی بک‌اند) ست کن.
3. یه سرویس PostgreSQL و یه سرویس Redis (یا از افزونه‌های آماده‌ی رانفلر اگه داره، یا با Docker) بساز و `DATABASE_URL` / `REDIS_URL` رو توی بک‌اند تنظیم کن.
4. بعد از دیپلوی، حتماً `/api/health` رو چک کن و بعد صفحه‌ی فرانت رو باز کن تا مطمئن بشی WebSocket هم پشت زیرساخت رانفلر بدون قطعی وصل میشه (این مهم‌ترین ریسک این مرحله‌ست).

## ساختار پوشه‌ها

```
cafe-reservation/
├── backend/
│   ├── src/
│   │   ├── index.js      # سرور Express + Socket.io + health check
│   │   ├── db.js         # اتصال PostgreSQL
│   │   └── redis.js      # اتصال Redis
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # تست REST + WebSocket
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```
