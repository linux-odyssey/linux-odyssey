FROM linuxodyssey/quest-base

USER root
COPY home .
RUN chown -R ${USERNAME}:${USERNAME} .

USER ${USERNAME}