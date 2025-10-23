# FROM registry.access.redhat.com/ubi8/nodejs-18
# WORKDIR /app
# COPY --chown=1001:1001 package*.json ./
# COPY --chown=1001:1001 . .
 
# RUN npm install 
# #RUN npm install axios
# #RUN npm install express
# #RUN npm install cors
# #RUN npm install dotenv
# #RUN npm ci
# COPY . .
# # Compile the source TS into JS files
# #RUN npm run build:ts

# EXPOSE 8002
# CMD ["node", "server.js"]
# ---------- Stage 1: Build tools with root access ----------
    FROM registry.access.redhat.com/ubi8/ubi as builder

    RUN dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-3.noarch.rpm --nogpgcheck && \
        dnf install -y mysql-shell --nogpgcheck && dnf install jq -y && \
        dnf clean all
    
    # ---------- Stage 2: Main app image ----------
    FROM registry.access.redhat.com/ubi8/nodejs-18
    
    WORKDIR /app
    
    # Copy only mysqlsh binary and libraries from builder
    COPY --from=builder /usr/bin/mysqlsh /usr/bin/mysqlsh
    COPY --from=builder /usr/libexec/mysqlsh /usr/libexec/mysqlsh
    COPY --from=builder /usr/share/mysqlsh /usr/share/mysqlsh
    COPY --from=builder /usr/lib/mysqlsh /usr/lib/mysqlsh
    COPY --from=builder /usr/bin/jq /usr/bin/jq

    # Copy project files with correct ownership
    COPY --chown=1001:1001 package*.json ./
    RUN npm install && mkdir /app/script && chmod -R 777 /app/script
    ENV AIOPSSHPATH=/app/script
    COPY --chown=1001:1001 . .
    COPY aiops-script.sh /app/script

    EXPOSE 8002
    CMD ["node", "server.js"]
