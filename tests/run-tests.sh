#!/bin/bash

# Clown.js Self-Hosted Test Runner
# Tests the framework using itself

echo "🤡 Running Clown.js Self-Hosted Tests"
echo "======================================"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Run each test file individually
echo "📝 Running matchers.test.js..."
node "$PROJECT_ROOT/bin/clown.js" "$PROJECT_ROOT/tests/matchers.test.js"
MATCHERS_EXIT=$?

echo ""
echo "🎭 Running unique-features.test.js..."
node "$PROJECT_ROOT/bin/clown.js" "$PROJECT_ROOT/tests/unique-features.test.js"
UNIQUE_EXIT=$?

echo ""
echo "🎪 Running mock.test.js..."
node "$PROJECT_ROOT/bin/clown.js" "$PROJECT_ROOT/tests/mock.test.js"
MOCK_EXIT=$?

echo ""
echo "🪝 Running hooks.test.js..."
node "$PROJECT_ROOT/bin/clown.js" "$PROJECT_ROOT/tests/hooks.test.js"
HOOKS_EXIT=$?

echo ""
echo "📡 Running ask-channel.test.js..."
node "$PROJECT_ROOT/bin/clown.js" "$PROJECT_ROOT/tests/ask-channel.test.js"
ASK_EXIT=$?

echo ""
echo "======================================"
echo "🎉 Test Summary"
echo "======================================"

TOTAL_FAILED=0

if [ $MATCHERS_EXIT -eq 0 ]; then
  echo "✅ matchers.test.js - PASSED"
else
  echo "❌ matchers.test.js - FAILED"
  TOTAL_FAILED=$((TOTAL_FAILED + 1))
fi

if [ $UNIQUE_EXIT -eq 0 ]; then
  echo "✅ unique-features.test.js - PASSED"
else
  echo "❌ unique-features.test.js - FAILED"
  TOTAL_FAILED=$((TOTAL_FAILED + 1))
fi

if [ $MOCK_EXIT -eq 0 ]; then
  echo "✅ mock.test.js - PASSED"
else
  echo "❌ mock.test.js - FAILED"
  TOTAL_FAILED=$((TOTAL_FAILED + 1))
fi

if [ $HOOKS_EXIT -eq 0 ]; then
  echo "✅ hooks.test.js - PASSED"
else
  echo "❌ hooks.test.js - FAILED"
  TOTAL_FAILED=$((TOTAL_FAILED + 1))
fi

if [ $ASK_EXIT -eq 0 ]; then
  echo "✅ ask-channel.test.js - PASSED"
else
  echo "❌ ask-channel.test.js - FAILED"
  TOTAL_FAILED=$((TOTAL_FAILED + 1))
fi

echo ""
if [ $TOTAL_FAILED -eq 0 ]; then
  echo "🎊 All test suites passed!"
  exit 0
else
  echo "💥 $TOTAL_FAILED test suite(s) failed"
  exit 1
fi
