# base docker
FROM node:lts-slim

# Create app directory and cd into it
RUN mkdir -p /usr/fantasta_server
WORKDIR /usr/fantasta_server

# copy the npmrc file in order to install the private npm package from azure
COPY .npmrc .npmrc

# copy package.json and package-lock.json
COPY package.json package-lock.json /usr/fantasta_server/

# Install app dependencies
#RUN if [ "$NODE_ENV" = "dev" ]; \
#        then npm install; \
#        else npm install --only=production; \
#    fi

# Install app dependencies
RUN npm install

# Bundle app source
COPY . /usr/fantasta_server

# removing the npmrc file after npm install
RUN rm -f .npmrc

# LA PORTA VIENE ESPOSTA IN DOCKER COMPOSE.
# SE LO FAI NEL DOCKERFILE CREI UNA IMMAGINE DI DOCKER CHE ESPORRA SEMPRE QUELLA PORTA
# SE LO FAI IN DOCKER COMPOSE, DECIDI DI ESPORRE UNA PORTA AL MOMENTO IN CUI LO LANCI
# IN QUESTO MODO HAI LA POSSIBILITÀ DI ESPORRE UNA QUALSIASI PORTA AL MOMENTO DEL LANCIO CON
# DOCKER COMPOSE E NON DEVI RICREARTI L'IMMAGINE DI DOCKER OGNI VOLTA CHE VUOI CAMBIARE PORTA
# expose a specific port
EXPOSE 3000

# IL COMANDO VIENE DEFINITO IN DOCKER COMPOSE
# STESSO DISCORSO FATTO PRIMA
# run the server
CMD [ "npm", "start" ]
