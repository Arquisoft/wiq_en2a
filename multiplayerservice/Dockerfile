# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/multiplayerservice

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

ARG WEBAPP_URI="http://localhost:80"
ENV WEBAPP_ENDPOINT=$WEBAPP_URI

# Copy the app source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8006

# Define the command to run your app
CMD ["npm", "run", "start:prod"]
