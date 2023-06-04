FROM node:16

WORKDIR /usr/src/wipeqr

RUN npm install -g nodemon

COPY . /usr/src/wipeqr

RUN npm install

EXPOSE 3010

CMD ["npm", "run", "backend"]