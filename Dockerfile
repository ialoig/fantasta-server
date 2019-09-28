# base docker
FROM node:lts-slim


# Create app directory and cd into it
RUN mkdir -p /usr/fantasta_core
WORKDIR /usr/fantasta_core

# copy the npmrc file in order to install the private npm package from azure
COPY .npmrc .npmrc

# copy package.json and package-lock.json
COPY package*.json package-lock.json /usr/fantasta_core/

# Install app dependencies
RUN npm install

# Bundle app source
COPY . /usr/fantasta_core

# removing the npmrc file after npm install
RUN rm -f .npmrc

# expose a specific port
EXPOSE 3000

# install nodemon for changes on the fly
#RUN npm install -g nodemon

# run the server
CMD [ "npm", "start" ]
