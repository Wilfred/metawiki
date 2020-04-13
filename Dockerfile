FROM node:13-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV NODE_ENV production
RUN npm install

# Bundle app source
COPY . .

EXPOSE 9002
CMD [ "./bin/start-sandbox" ]
