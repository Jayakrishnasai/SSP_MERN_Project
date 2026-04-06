FROM nginxinc/nginx-unprivileged:alpine

# Remove default config (IMPORTANT)
RUN rm /etc/nginx/conf.d/default.conf

# Copy your config properly
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html

# Ensure temp dirs exist and are writable
RUN mkdir -p /tmp/client_temp \
    /tmp/proxy_temp \
    /tmp/fastcgi_temp \
    /tmp/uwsgi_temp \
    /tmp/scgi_temp \
    && chmod -R 777 /tmp

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]