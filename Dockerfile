FROM nginx:1.27.2-bookworm
RUN echo "hello" > /tmp.txt
COPY ./static /usr/share/nginx/html