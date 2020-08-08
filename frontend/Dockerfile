FROM node:alpine AS builder
WORKDIR '/usr/app'

COPY './src/package.json' './'
COPY './src/yarn.lock' './'
RUN yarn

COPY './src/' './'

CMD ["yarn", "build"]



FROM nginx:alpine
WORKDIR '/etc/nginx/conf.d/'
COPY './nginx/default.conf' './default.conf'

WORKDIR '/usr/share/nginx/html/'
COPY --from=builder '/usr/app/build/' './'
