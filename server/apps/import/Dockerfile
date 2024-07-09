FROM node:alpine

WORKDIR /usr/app/src

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm i -g pm2

CMD ["pm2-runtime", "dist/apps/import/main.js", "-i", "max"]