## Build Environment
FROM node:14.18 AS build-env
# Build Steps
ADD . /app
WORKDIR /app
COPY package.json package*.json ./
RUN npm install --only=production
RUN npm run build

## Run Environment
FROM node:14.18-slim
# Copy Build artefacts
COPY --from=build-env /app /app
# Run Code
WORKDIR /app
CMD [ "node", "." ]