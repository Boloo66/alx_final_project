#Install node version
FROM node:20-alpine

#Set up working directory
WORKDIR /app

#Copy package.json and install node modules
COPY ./package*.json ./
RUN npm cache clean --force && npm install --force

#Copy required folders
COPY . .

#Expose port and start server
EXPOSE 5050
CMD [ "npm",  "start:dev"]
