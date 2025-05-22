# Build phase
FROM node:18 AS builder
WORKDIR /app

# Copy package files & install
COPY package.json yarn.lock ./
RUN yarn install

# Copy code sau khi đã install
COPY . .

RUN yarn build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]