FROM node:20-alpine AS build

# VITE_API_URL باید در زمان build ست بشه چون Vite متغیرهای env رو داخل باندل کامپایل می‌کنه
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- مرحله‌ی سرو کردن فایل‌های استاتیک ----
FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
