#!/bin/bash

CURRENT=$(openclaw --version 2>/dev/null | grep -oP '\d+\.\d+\.\d+')
LATEST=$(npm view openclaw version 2>/dev/null)

echo "Current version: $CURRENT"
echo "Latest version: $LATEST"

if [ "$CURRENT" != "$LATEST" ]; then
    echo "=== New version available! ==="
    echo "New: $LATEST | Current: $CURRENT"
    
    # Get changelog
    echo ""
    echo "=== Recent Changes ==="
    npm view openclaw releases 2>/dev/null | head -20
else
    echo "Already up to date!"
fi
