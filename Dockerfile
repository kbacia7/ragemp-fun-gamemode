FROM frolvlad/alpine-glibc
RUN apk update && apk add \ 
    libstdc++ \
    curl && \
    curl https://cdn.rage.mp/lin/ragemp-srv-037.tar.gz | tar -xz && \
    chmod +x /ragemp-srv/server 
COPY ./dist/ /ragemp-srv/
WORKDIR /ragemp-srv/
CMD ["./server"]