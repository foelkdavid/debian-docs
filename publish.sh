#!/bin/sh
set -eu

namespace="debian-docs"
deployment="debian-docs"

printf 'Restarting %s/%s...\n' "$namespace" "$deployment"
kubectl -n "$namespace" delete pod \
  -l "app.kubernetes.io/name=$deployment" \
  --grace-period=0 \
  --force \
  --wait=true

printf 'Waiting for the replacement pod...\n'
attempt=0
pod=""
while [ -z "$pod" ]; do
  attempt=$((attempt + 1))
  if [ "$attempt" -gt 60 ]; then
    printf 'Timed out waiting for the replacement pod to be created.\n' >&2
    exit 1
  fi

  pod=$(kubectl -n "$namespace" get pods \
    -l "app.kubernetes.io/name=$deployment" \
    -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || true)
  [ -n "$pod" ] || sleep 1
done

kubectl -n "$namespace" wait --for=condition=Ready "pod/$pod" --timeout=5m

printf 'Published successfully: https://docs.debian.foelk.com\n'
