#!/bin/sh
set -eu

namespace="debian-docs"
deployment="debian-docs"

printf 'Restarting %s/%s...\n' "$namespace" "$deployment"
kubectl -n "$namespace" rollout restart "deployment/$deployment"

if ! kubectl -n "$namespace" rollout status "deployment/$deployment" --timeout=20s; then
  printf 'Rollout is waiting; force-deleting old pods already in Terminating state...\n'

  kubectl -n "$namespace" get pods \
    -l "app.kubernetes.io/name=$deployment" \
    -o jsonpath='{range .items[?(@.metadata.deletionTimestamp)]}{.metadata.name}{"\n"}{end}' |
  while IFS= read -r pod; do
    [ -n "$pod" ] || continue
    printf 'Force-deleting pod %s...\n' "$pod"
    kubectl -n "$namespace" delete pod "$pod" --grace-period=0 --force --wait=false
  done

  kubectl -n "$namespace" rollout status "deployment/$deployment" --timeout=5m
fi

printf 'Published successfully: https://docs.debian.foelk.com\n'
