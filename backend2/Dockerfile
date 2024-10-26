FROM node:23-bookworm
COPY package*.json /app/ 
WORKDIR /app
RUN npm install

# changing parts
COPY . /app
ENV PORT=3000
EXPOSE 3000

CMD [ "npm","run","dev" ]