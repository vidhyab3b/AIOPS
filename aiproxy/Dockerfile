FROM registry.access.redhat.com/ubi8/nodejs-18
WORKDIR /app
COPY --chown=1001:1001 package*.json ./
COPY --chown=1001:1001 . .
 
RUN npm install 
#RUN npm install axios
#RUN npm install express
#RUN npm install cors
#RUN npm install dotenv
#RUN npm ci
COPY . .
# Compile the source TS into JS files
#RUN npm run build:ts

EXPOSE 8002
CMD ["node", "server.js"]
