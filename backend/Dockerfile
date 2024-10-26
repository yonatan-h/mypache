FROM python:3.14.0a1-slim-bullseye As builder
#3.14.0a1-slim
# install the dependencies for the project
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt


# run the project
FROM python:3.14.0a1-slim-bullseye As runtime

# RUN apt-get update && \
#     apt-get install -y curl build-essential && \
#     apt-get clean

# RUN curl  --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

