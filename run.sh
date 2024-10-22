#! /bin/bash
docker build -t myengine . &&
docker run --rm -v ./static:/usr/share/nginx/html -p 5000:80  myengine