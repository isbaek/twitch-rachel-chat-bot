FROM node:18-alpine

RUN npm install
CMD ["npm", "run", "start"]
