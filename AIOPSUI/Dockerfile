FROM node
WORKDIR /app
COPY package*.json ./
COPY ./ .
RUN npm install
RUN chmod -R 777 /app/node_modules
EXPOSE 8000
CMD ["npm", "start"]


