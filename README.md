## Overbuilt Fibonacci

This overbuilt Fibonacci calculator uses six components:
- A reverse proxy to handle requests to multiple pieces
- A frontend server for the React client application
- A backend Express server for handling data requests
- A Redis caching server for handling calculation requests and results
- A Postgres database for storing all requested numbers
- A Node worker process for handling requests from Redis and doing the actual calculation

The reverse proxy is nginx. In production, the frontend server is a separate nginx installation. In development, that second nginx server is replaced with a standard `create-react-app` development environment.

## Running in development

```sh
docker-compose up
```

## Building for production

Travis builds container images and pushes them to AWS through Docker Hub using the included configuration. In AWS we use ElastiCache for Redis, and RDS for Postgres. Those are configured separately.

To build production images locally, simply run `docker build .` in the `backend`, `frontend`, `web`, and `worker` directories.
