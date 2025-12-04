#!/bin/bash

PREFIX="${PREFIX:-$HOME/.local}"
BINDIR="$PREFIX/bin"

echo "Uninstalling docklite..."

rm -f "$BINDIR/docklite"

echo "Uninstall complete!"
echo "Note: Container data in $PREFIX/var/docklite was not removed"
