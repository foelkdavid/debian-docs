# Add a new page

Create a Markdown file below `docs/`, then add it to the `nav` section in `mkdocs.yml`.

```text
docs/
└── how-to/
    └── configure-ssh.md
```

A useful starting template:

```markdown
# Configure SSH

One sentence describing the outcome.

## Prerequisites

- A Debian machine
- A user with sudo access

## Configure it

Explain the steps here.

## Verify

Show one command that proves it works.
```

Preview locally with Docker:

```sh
docker run --rm -it -p 8000:8000 -v "$PWD:/docs" squidfunk/mkdocs-material:9.7.7
```

Then open [http://localhost:8000](http://localhost:8000).
