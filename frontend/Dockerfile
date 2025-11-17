# Multi-stage Dockerfile for building a Create React App and serving with nginx
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies (use package-lock if present)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config so we can change the listen port (avoid host conflicts)
# This file will set nginx to listen on 8081 inside the container.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose a non-conflicting port for the frontend
EXPOSE 8081

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
