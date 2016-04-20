# bitly-secret-service
generates bitly links

Example:

curl -H "Content-Type: application/json" -X POST -d '{"url":"http://el.s.todo.to.it/cryptoloji/1033/?data=eyJtZXNzYWdlIjoi8J%2BRu%2FCfmKnwn42P8J%2BPgiDwn5CR8J%2BPgiDwn5iB8J%2BahPCfkqXwn5iT8J%2BTkiIsImtleSI6IvCfmIAifQ%3D%3D#/landing"}' http://localhost:8714/generate/

To run:

cp sample.env .env
npm install
npm start

Env values

TOKEN: Required, this is the token created by bitly, it's a secret to everybody.
PORT: Required, defaults to 8714.
ALLOWED_ORIGIN: Whatever origin you want to allow. Not required for local dev.
