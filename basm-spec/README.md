# BASM Specification

BASM (Based Assembly) is a register-based assembly language with strict register discipline and function-oriented syntax.

## Specification Documents

| Document | Description |
|----------|-------------|
| [Overview](overview.md) | High-level language design and philosophy |
| [Registers](registers.md) | Register set and conventions |
| [Instructions](instructions.md) | Instruction set reference |
| [Functions](functions.md) | Function calling conventions |
| [Memory](memory.md) | Memory model and addressing |
| [Types](types.md) | Type system and encoding |
| [Binary Format](binary-format.md) | `.basm` binary encoding specification |

## Design Principles

1. **Register Discipline** - Strict rules for register usage and preservation
2. **Function-First** - All code organized into callable functions
3. **Explicit Control** - No hidden behavior or implicit operations
4. **Minimal Core** - Small instruction set, composable primitives

## Status

This specification is in **Stage 1: Design & Documentation**.
