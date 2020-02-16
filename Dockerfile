# build stage
FROM node:10-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT CMD ["nginx", "-g", "daemon off;"]

#ENTRYPOINT NODE_ENV=production SCILLA_VERSION=0 npm run start

#c699770f095f3c38bf1f7e1bba853dfcadcce98d