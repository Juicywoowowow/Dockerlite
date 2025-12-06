# BASM Overview

## Introduction

BASM (Based Assembly) is a low-level programming language designed with modern sensibilities while maintaining the power and control of traditional assembly.

## Key Characteristics

### Register-Based Architecture

BASM operates on a fixed set of registers rather than a stack machine model. All computations flow through registers with explicit data movement.

### High Register Discipline

Registers have designated purposes and strict conventions:
- Caller-saved vs callee-saved semantics
- Dedicated registers for specific operations
- Clear ownership rules across function boundaries

### Function-Oriented Syntax

Unlike traditional assembly's label-based flow, BASM organizes code into explicit function blocks:

```basm
fn add(r0, r1) -> r0 {
    add r0, r0, r1
    ret
}
```

### Explicit Over Implicit

- No hidden register modifications
- No implicit type conversions
- No automatic stack management (unless requested)

## Comparison to Other Assemblies

| Feature | x86 | ARM | WebAssembly | BASM |
|---------|-----|-----|-------------|------|
| Model | CISC | RISC | Stack | Register |
| Functions | Labels | Labels | First-class | First-class |
| Register Discipline | Loose | Moderate | N/A | Strict |
| Syntax Style | Mnemonic | Mnemonic | S-expr/Text | Function-call |

## Goals

1. Readable low-level code
2. Predictable performance characteristics
3. Easy to parse and compile
4. Suitable for both hand-writing and code generation
