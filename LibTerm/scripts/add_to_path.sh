#!/bin/bash

LIBTERM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="$LIBTERM_DIR/bin"

detect_shell_config() {
    if [ -n "$ZSH_VERSION" ]; then
        echo "$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        echo "$HOME/.bashrc"
    else
        echo "$HOME/.profile"
    fi
}

SHELL_CONFIG=$(detect_shell_config)
PATH_LINE="export PATH=\"\$PATH:$BIN_DIR\""

if ! grep -q "$BIN_DIR" "$SHELL_CONFIG" 2>/dev/null; then
    echo "" >> "$SHELL_CONFIG"
    echo "# LibTerm PATH" >> "$SHELL_CONFIG"
    echo "$PATH_LINE" >> "$SHELL_CONFIG"
    echo "✓ Added LibTerm to PATH in $SHELL_CONFIG"
else
    echo "LibTerm already in PATH"
fi

export PATH="$PATH:$BIN_DIR"
exit 0
