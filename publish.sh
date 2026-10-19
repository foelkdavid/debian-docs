#!/bin/sh
set -eu

# Run from any directory; the builder always uses the mounted docs repository.
kubectl -n debian-docs exec -i deployment/debian-docs -c builder -- python - <<'PYTHON'
import fcntl
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

started = time.monotonic()
site = Path('/site')
with (site / '.publish.lock').open('w') as lock:
    fcntl.flock(lock, fcntl.LOCK_EX)
    target = Path(tempfile.mkdtemp(prefix='build-', dir=site))
    try:
        subprocess.run(['mkdocs', 'build', '--strict', '--site-dir', str(target)],
                       cwd='/docs', check=True)
        # Publish only successful builds. nginx sees the switch immediately.
        target.chmod(0o755)
        previous = (site / 'current').resolve()
        pending = site / '.current-next'
        pending.unlink(missing_ok=True)
        pending.symlink_to(target.name)
        os.replace(pending, site / 'current')
    except BaseException:
        shutil.rmtree(target)
        raise
    # Retain the previous build for requests already in progress.
    for old in site.iterdir():
        if old.is_dir() and not old.is_symlink() and old not in (target, previous):
            if old.name.startswith('build-') or old.name == 'initial':
                shutil.rmtree(old)
print(f'Published in {time.monotonic() - started:.2f}s: https://docs.debian.foelk.com')
PYTHON
