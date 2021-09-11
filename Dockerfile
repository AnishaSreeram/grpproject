FROM node:latest
RUN cd /projefrontend && npm i && npm run build
RUN cd ../projbackend && npm i 

WORKDIR /usr/src

COPY ./ ./

WORKDIR /usr/src/src
CMD ['npm', 'start']