FROM docker.io/library/node:latest
WORKDIR /app
COPY package*.json ./
COPY ./ .
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
