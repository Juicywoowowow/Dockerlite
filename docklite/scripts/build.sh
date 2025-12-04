#!/bin/bash

set -e

echo "Building docklite..."
make clean
make all

echo "Build complete!"
