# ---------- Stage 1: Build tools with root access ----------
FROM registry.access.redhat.com/ubi8/ubi as builder

RUN dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-3.noarch.rpm --nogpgcheck && \
    dnf install -y mysql-shell --nogpgcheck && \
    dnf clean all && rpm -ql mysql-shell | head -20

# ---------- Stage 2: Main app image ----------
FROM registry.access.redhat.com/ubi8/nodejs-18

WORKDIR /app

# Copy only mysqlsh binary and libraries from builder
COPY --from=builder /usr/bin/mysqlsh /usr/bin/mysqlsh
COPY --from=builder /usr/libexec/mysqlsh /usr/libexec/mysqlsh
COPY --from=builder /usr/share/mysqlsh /usr/share/mysqlsh
COPY --from=builder /usr/lib/mysqlsh /usr/lib/mysqlsh

# Copy project files with correct ownership
COPY --chown=1001:1001 package*.json ./
RUN npm install
ENV AIOPSSHPATH=/root
COPY --chown=1001:1001 . .

EXPOSE 8002
CMD ["node", "server.js"]
