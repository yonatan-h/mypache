FROM node:23-bookworm

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install

EXPOSE 5173
CMD [ "npm", "run", "dev" ]