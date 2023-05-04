FROM node:18-alpine

EXPOSE 8080
WORKDIR /app
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
