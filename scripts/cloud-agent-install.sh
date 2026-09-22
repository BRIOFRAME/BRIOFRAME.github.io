#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for BRIOFRAME.github.io (static HTML library).
set -euo pipefail
cd /workspace
python3 tests/validate_site.py
