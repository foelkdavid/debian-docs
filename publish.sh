#!/bin/sh
set -eu

namespace="debian-docs"
deployment="debian-docs"

printf 'Restarting %s/%s...\n' "$namespace" "$deployment"
kubectl -n "$namespace" rollout restart "deployment/$deployment"
kubectl -n "$namespace" rollout status "deployment/$deployment" --timeout=5m

printf 'Published successfully: https://docs.debian.foelk.com\n'
