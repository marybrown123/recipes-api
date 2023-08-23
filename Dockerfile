FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG DATABASE_HOST
ENV DATABASE_HOST=$DATABASE_HOST

ARG DATABASE_PORT            
ENV DATABASE_PORT=$DATABASE_PORT

ARG DATABASE_USER
ENV DATABASE_USER=$DATABASE_USER

ARG DATABASE_PASSWORD
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD

ARG DATABASE_NAME
ENV DATABASE_NAME=$DATABASE_NAME

ARG PORT
ENV PORT=$PORT

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

ARG ADMIN_NAME
ENV ADMIN_NAME=$ADMIN_NAME

ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD

ARG TEST_NAME
ENV TEST_NAME=$TEST_NAME

ARG TEST_PASSWORD
ENV TEST_PASSWORD=$TEST_PASSWORD

ARG REDIS_HOST
ENV REDIS_HOST=$REDIS_HOST

ARG REDIS_PORT
ENV REDIS_PORT=$RESIS_PORT

ARG REDIS_USERNAME
ENV REDIS_USERNAME=$REDIS_USERNAME

ARG REDIS_PASSWORD
ENV REDIS_PASSWORD=$REDIS_PASSWORD

ARG TTL_IN_SECONDS
ENV TTL_IN_SECONDS=$TTL_IN_SECONDS

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=$AWS_ACCES_KEY_ID

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

ARG AWS_S3_REGION
ENV AWS_S3_REGION=$AWS_S3_REGION

ARG S3_BUCKET_NAME
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME

RUN npx prisma generate && npm run build

CMD [ "node", "dist/main.js" ]