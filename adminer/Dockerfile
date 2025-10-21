FROM docker.io/library/php:8.2-cli
COPY . /usr/src/myapp
WORKDIR /usr/src/myapp

RUN docker-php-ext-install mysqli 
COPY . /opt/app-root/src

CMD /bin/bash -c 'php -S 0.0.0.0:8000'

EXPOSE 8000
