FROM golang:1.19-alpine AS go

WORKDIR /app
COPY ./ .

RUN go mod tidy && go build -o bin .
# --
FROM alpine:latest

WORKDIR /app
COPY --from=go /app/bin ./bin

CMD ["./bin"]
