# 1️⃣ Base Image
FROM node:20 as base

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json, pnpm-lock.yaml, and workspace settings
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 4️⃣ Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# 5️⃣ Install dependencies (Only production)
RUN pnpm install --frozen-lockfile --prod

# 6️⃣ Copy the entire project (excluding files in .dockerignore)
COPY . .

# 7️⃣ Build the application
RUN pnpm build

# 8️⃣ Expose the required ports
EXPOSE 3000 3001

# 9️⃣ Start both services using PM2 (for process management)
CMD ["pnpm", "start:all"]
