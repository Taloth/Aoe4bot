FROM node:15

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

ENV PORT=8080
COPY index.js ./
COPY aoe4/ ./aoe4/
COPY views/ ./views/

RUN ls -al

EXPOSE 8080
CMD [ "node", "index.js" ]