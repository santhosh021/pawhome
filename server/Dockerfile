FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
# Uploaded pet photos live here (mounted as a volume in docker-compose)
RUN mkdir -p /data/uploads && chown -R node:node /data /app
ENV UPLOAD_DIR=/data/uploads
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]
