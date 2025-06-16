FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/* /etc/nginx/conf.d/
USER root
RUN apk add --no-cache openssl
RUN openssl req -x509 -newkey rsa:2048 -keyout /etc/ssl/private/test.key -out /etc/ssl/certs/test.crt -days 365 -nodes -subj "/C=AT/L=Graz/CN=127.0.0.1:5000"
