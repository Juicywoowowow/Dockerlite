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

if grep -q "$BIN_DIR" "$SHELL_CONFIG" 2>/dev/null; then
    sed -i.bak "/# LibTerm PATH/d" "$SHELL_CONFIG"
    sed -i.bak "\|$BIN_DIR|d" "$SHELL_CONFIG"
    rm -f "${SHELL_CONFIG}.bak"
    echo "✓ Removed LibTerm from PATH"
else
    echo "LibTerm not found in PATH"
fi

exit 0
