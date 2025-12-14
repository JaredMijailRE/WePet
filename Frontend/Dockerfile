FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Argument to allow passing API URLs at build time
ARG EXPO_PUBLIC_PET_API_URL
ARG EXPO_PUBLIC_USER_API_URL
ARG EXPO_PUBLIC_GROUP_API_URL
ARG EXPO_PUBLIC_SHARING_API_URL

ENV EXPO_PUBLIC_PET_API_URL=$EXPO_PUBLIC_PET_API_URL
ENV EXPO_PUBLIC_USER_API_URL=$EXPO_PUBLIC_USER_API_URL
ENV EXPO_PUBLIC_GROUP_API_URL=$EXPO_PUBLIC_GROUP_API_URL
ENV EXPO_PUBLIC_SHARING_API_URL=$EXPO_PUBLIC_SHARING_API_URL

RUN npx expo export -p web

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx config for SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
