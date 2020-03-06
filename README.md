**This project is not maintained anymore.**

# Bitly Secret Service

## Description
generates bitly links

## Setup

```
$> cp sample.env .env
$> npm install
```

## Environment Variables

|Variable|About|
|--------|-----|
| TOKEN | Required, this is the token created by bitly, it's a secret to everybody |
| PORT | Required, defaults to 8714 |
| ALLOWED_ORIGIN | Whatever origin you want to allow. Not required for local dev |
| ALLOWED_ORIGIN | Whatever origin you want to allow. Not required for local dev |
| REDIS_URL | Url for redis server, not required for local dev |
| RATE_LIMIT | rate/window for rate limiting, defaults to 30/minute, can use second/minute/hour |
| LIMIT_USING_X_FORWARED_FOR | How we detect for rate limiting, set to true when hosted behind a proxy/load balancer/router |

## To run

```
$> npm start
```

## Example Usage

```
$> curl -H "Content-Type: application/json" -X POST -d '{"url":"http://el.s.todo.to.it/cryptoloji/1033/?data=eyJtZXNzYWdlIjoi8J%2BRu%2FCfmKnwn42P8J%2BPgiDwn5CR8J%2BPgiDwn5iB8J%2BahPCfkqXwn5iT8J%2BTkiIsImtleSI6IvCfmIAifQ%3D%3D#/landing"}' http://localhost:8714/generate/
```
