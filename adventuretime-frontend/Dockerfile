## Build Environment
FROM node:14.8 AS build-env

# Params
ARG TARGET_BUILD

# Build steps
ADD . /app
WORKDIR /app
# COPY package.json package*.json ./
RUN npm install
RUN npm run ${TARGET_BUILD}

## Run Environment
FROM nginx:alpine
# Params
ARG TARGET_BUILD
ARG SITE
# Copy build artefacts
COPY --from=build-env /app/dist /usr/share/nginx/html
COPY --from=build-env /app/nginx/${TARGET_BUILD}.conf /etc/nginx/conf.d/default.conf