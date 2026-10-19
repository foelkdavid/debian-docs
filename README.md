# Debian Setup documentation

The source for <https://docs.debian.foelk.com>. All documentation is ordinary Markdown under `docs/`; navigation and presentation are configured in `mkdocs.yml`.

## Preview locally

```sh
docker run --rm -it -p 8000:8000 -v "$PWD:/docs" squidfunk/mkdocs-material:9.7.7
```

Open <http://localhost:8000>. Changes are rebuilt automatically while the preview is running.

## Publish on the k3s host

After pulling the latest commit into `/srv/k3s/volumes/debian-docs/repository`, rebuild the running site:

```sh
./publish.sh
```

The deployment builds the static site with MkDocs Material and serves it with nginx. No content is stored in a database or Kubernetes ConfigMap.
