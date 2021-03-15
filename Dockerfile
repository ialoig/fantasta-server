# base docker
FROM node:lts-slim

# Create app directory and set WORKDIR. Each next command will run in the WORKDIR
RUN mkdir -p /usr/fantasta_server
RUN mkdir -p /usr/fantasta_server/config
RUN mkdir -p /usr/fantasta_server/src

WORKDIR /usr/fantasta_server

# Bundle app source
COPY package.json .

# Install app dependencies
#RUN if [ "$NODE_ENV" = "dev" ]; \
#        then npm install; \
#        else npm install --only=production; \
#    fi

######### only for development ###########
#RUN apt-get update &&\
# apt-get install -y procps &&\
# apt-get install vim -y
##########################################

# Install app dependencies
RUN npm install

COPY . .

# Build the built version
RUN npm run build

# Remove dev packages
# RUN npm prune --production

# expose a specific port (overwritten in docker-compose)
EXPOSE 3000

# run (overwritten in docker-compose)
# CMD [ "npm", "prod" ]
