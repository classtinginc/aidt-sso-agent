FROM nginx:1.24.0

COPY default.conf /etc/nginx/conf.d/

COPY config/nginx.conf /etc/nginx/nginx.conf

COPY sso /usr/share/nginx/html/sso


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]