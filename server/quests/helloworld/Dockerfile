FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
  curl \
  vim \
  jq

RUN adduser --disabled-password --gecos '' rudeus

USER rudeus

WORKDIR /home/rudeus

COPY ./home /home/rudeus/

CMD [ "/bin/bash" ]
