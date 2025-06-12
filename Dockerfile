# Build stage
FROM node:20-alpine AS build-env
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run build

# Production stage - using nginx to serve static files
FROM nginx:alpine
COPY --from=build-env /app/build/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]