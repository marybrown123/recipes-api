FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL = $DATABASE_URL

RUN npx prisma generate && npx prisma migrate deploy && npm run build

CMD [ "node", "dist/main.js" ]