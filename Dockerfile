FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npx prisma generate && npm run build

CMD [ "node", "dist/main.js" ]