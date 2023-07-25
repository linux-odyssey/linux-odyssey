FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
  curl \
  vim

WORKDIR /app

COPY . .

CMD [ "/bin/bash" ]