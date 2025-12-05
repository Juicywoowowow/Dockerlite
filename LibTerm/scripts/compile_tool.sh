#!/bin/bash

TOOL_NAME=$1
LIBTERM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOL_DIR="$LIBTERM_DIR/tools/$TOOL_NAME"
BIN_DIR="$LIBTERM_DIR/bin"

if [ -z "$TOOL_NAME" ]; then
    echo "Usage: $0 <tool_name>"
    exit 1
fi

if [ ! -d "$TOOL_DIR" ]; then
    echo "Error: Tool directory $TOOL_DIR not found"
    exit 1
fi

echo "Compiling $TOOL_NAME..."

cd "$TOOL_DIR"
make clean 2>/dev/null
make

if [ $? -eq 0 ]; then
    if [ -f "$TOOL_NAME" ]; then
        mv "$TOOL_NAME" "$BIN_DIR/"
        echo "✓ $TOOL_NAME compiled and moved to bin/"
        exit 0
    else
        echo "✗ Binary not found after compilation"
        exit 1
    fi
else
    echo "✗ Compilation failed"
    exit 1
fi
