FROM node:18-alpine

EXPOSE 8080
WORKDIR /app
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "run", "start"]
