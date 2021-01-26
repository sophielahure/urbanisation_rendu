# Create image based on the official Node 10 image from dockerhub
FROM node:10

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

RUN rm -rf /app/e2e
RUN rm -rf /app/node_modules

# Install dependecies
RUN npm install
#RUN npm cache clean --force
RUN npm run postinstall

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "start"]

