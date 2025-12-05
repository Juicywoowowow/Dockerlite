#!/bin/bash

LIBTERM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_FILE="$LIBTERM_DIR/.libterm/state.txt"

echo "Setting up LibTerm..."

mkdir -p "$LIBTERM_DIR/.libterm"
mkdir -p "$LIBTERM_DIR/bin"

if [ ! -f "$STATE_FILE" ]; then
    echo "jsonparse:inactive" > "$STATE_FILE"
    echo "netscan:inactive" >> "$STATE_FILE"
    echo "hashcrack:inactive" >> "$STATE_FILE"
    echo "portscan:inactive" >> "$STATE_FILE"
    echo "b64tool:inactive" >> "$STATE_FILE"
    echo "hexdump:inactive" >> "$STATE_FILE"
    echo "Created state file"
fi

chmod +x "$LIBTERM_DIR/scripts/"*.sh

echo "LibTerm setup complete!"
echo "Run: ./bin/libterm"
