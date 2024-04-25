FROM node:20

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

ARG MULTIPLAYER_URI="http://localhost:8006"
ENV REACT_APP_MULTIPLAYER_ENDPOINT=$MULTIPLAYER_URI


#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]

USER node