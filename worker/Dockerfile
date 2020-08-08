FROM node:alpine
WORKDIR '/usr/app'

COPY './src/package.json' './'
COPY './src/yarn.lock' './'
RUN yarn

COPY './src/' './'

CMD ["yarn", "start"]
