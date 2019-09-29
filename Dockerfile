# base docker
FROM node:lts-slim

# Create app directory and cd into it
RUN mkdir -p /usr/fantasta_core
WORKDIR /usr/fantasta_core

# copy the npmrc file in order to install the private npm package from azure
COPY .npmrc .npmrc

# copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install app dependencies
#RUN if [ "$NODE_ENV" = "dev" ]; \
#        then npm install; \
#        else npm install --only=production; \
#    fi

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# removing the npmrc file after npm install
RUN rm -f .npmrc
