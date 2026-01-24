# Kubernetes (local) deployment

## Build images (local Docker)

```
docker build -t irecruit-api:local ./server
docker build -t irecruit-web:local ./client
```

Note: Next.js embeds `NEXT_PUBLIC_*` at build time. If you need a different public API URL, update `client/.env.production` before building.

## Apply manifests

```
kubectl apply -f k8s
```

## Access

- Web: http://localhost:30040
- API: http://localhost:30080/api

## Scale

```
kubectl scale deployment/irecruit-api --replicas=3
kubectl scale deployment/irecruit-web --replicas=3
```
