#!/bin/bash

set -e

echo "Running docklite tests..."

if [ ! -f bin/docklite ]; then
    echo "Error: docklite binary not found. Run 'make' first."
    exit 1
fi

echo "Testing docklite version..."
./bin/docklite 2>&1 | grep -q "Docklite" && echo "✓ Version check passed"

echo ""
echo "All tests passed!"
