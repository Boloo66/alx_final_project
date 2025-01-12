#Use node v 20 image
FROM node:20-alpine

#Set working directory
WORKDIR /app

#Copy package.json files
COPY package.json package-lock.json ./

#Copy the package and install node modules
RUN npm cache clean --force \
    && npm install --force --legacy-peer-deps || npm install --force --legacy-peer-deps

#Copy rest the rest of the files
COPY . .

#Expose port
EXPOSE  5173

#start the app
CMD ["npm", "run", "dev"]
