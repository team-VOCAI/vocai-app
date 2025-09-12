# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN node -e "console.log('GEMINI?', !!process.env.GEMINI_API_KEY)"  # 디버그: true가 찍혀야 함
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
EXPOSE 3000
CMD ["npm","start"]

