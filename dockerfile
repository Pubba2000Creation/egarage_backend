
#1️⃣ Base Image
FROM node:20 AS base

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Install pnpm version 9.12.1 globally
RUN npm install -g pnpm@9.12.1

# 4️⃣ Install NestJS CLI globally
RUN npm install -g @nestjs/cli

#copy env file
# Copy the .env file into the container
COPY .env .env
# 5️⃣ Copy package.json, pnpm-lock.yaml, and workspace settings
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 6️⃣ Install dependencies (Only production)
RUN pnpm install --frozen-lockfile

# 7️⃣ Copy the entire project (excluding files in .dockerignore)
COPY . .

# 8️⃣ Build the application
RUN pnpm build

# 9️⃣ Expose the required ports
EXPOSE 3000 3001 3002

# 🔟 Start both services using PM2 (for process management)
CMD ["pnpm", "run", "start"]
