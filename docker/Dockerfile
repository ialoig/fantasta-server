# base docker
FROM node:lts-slim


# Create app directory and cd into it
RUN mkdir -p /usr/fantasta_core
WORKDIR /usr/fantasta_core


# copy package.json and package-lock.json
COPY package*.json package-lock.json /usr/fantasta_core/


# Install app dependencies
RUN npm install


# Bundle app source
COPY . /usr/fantasta_core


# expose a specific port
EXPOSE 3000

# install nodemon for changes on the fly
#RUN npm install -g nodemon

# run the server
CMD [ "npm", "start" ]
