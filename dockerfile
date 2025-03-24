
#1️⃣ Base Image
FROM node:20 AS base

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Install pnpm version 9.12.1 globally
RUN npm install -g pnpm@9.12.1

# 4️⃣ Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# 5️⃣ Copy package.json, pnpm-lock.yaml, and workspace settings
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./




# 6️⃣ Install dependencies (Only production)
RUN pnpm install --frozen-lockfile

# 7️⃣ Dynamically inject environment variables as build arguments
ARG APP_ENV
ARG PORT
ARG MONGODB_URI
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG JWT_REFRESH_SECRET
ARG JWT_REFRESH_EXPIRES_IN
ARG MAIL_HOST
ARG MAIL_PORT
ARG MAIL_USER
ARG MAIL_SERVICE
ARG MAIL_PASSWORD
ARG MAIL_FROM
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_S3_BUCKET_NAME

# Write the injected variables to a .env file
RUN echo "APP_ENV=${APP_ENV}" > .env && \
    echo "PORT=${PORT}" >> .env && \
    echo "MONGODB_URI=${MONGODB_URI}" >> .env && \
    echo "JWT_SECRET=${JWT_SECRET}" >> .env && \
    echo "JWT_EXPIRES_IN=${JWT_EXPIRES_IN}" >> .env && \
    echo "JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}" >> .env && \
    echo "JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN}" >> .env && \
    echo "MAIL_HOST=${MAIL_HOST}" >> .env && \
    echo "MAIL_PORT=${MAIL_PORT}" >> .env && \
    echo "MAIL_USER=${MAIL_USER}" >> .env && \
    echo "MAIL_SERVICE=${MAIL_SERVICE}" >> .env && \
    echo "MAIL_PASSWORD=${MAIL_PASSWORD}" >> .env && \
    echo "MAIL_FROM=${MAIL_FROM}" >> .env && \
    echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" >> .env && \
    echo "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" >> .env && \
    echo "AWS_REGION=${AWS_REGION}" >> .env && \
    echo "AWS_S3_BUCKET_NAME=${AWS_S3_BUCKET_NAME}" >> .env


# 7️⃣ Copy the entire project (excluding files in .dockerignore)
COPY . .

# 8️⃣ Build the application
RUN pnpm build

# 9️⃣ Expose the required ports
EXPOSE 3000 3001 3002

# 🔟 Start both services using PM2 (for process management)
CMD ["pnpm", "run", "start"]
