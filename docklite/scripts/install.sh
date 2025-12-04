#!/bin/bash

set -e

PREFIX="${PREFIX:-$HOME/.local}"
BINDIR="$PREFIX/bin"
DATADIR="$PREFIX/var/docklite"

echo "Installing docklite to $PREFIX..."

mkdir -p "$BINDIR"
mkdir -p "$DATADIR/containers"
mkdir -p "$DATADIR/images"
mkdir -p "$DATADIR/layers"

cp bin/docklite "$BINDIR/"
chmod +x "$BINDIR/docklite"

echo "Installation complete!"
echo "Make sure $BINDIR is in your PATH"
echo ""
echo "Run 'docklite' to get started"
