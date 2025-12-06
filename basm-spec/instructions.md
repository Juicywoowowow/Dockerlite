# BASM Instructions

## Instruction Format

All instructions follow a consistent format:

```
opcode dest, src1, src2    ; three-operand
opcode dest, src           ; two-operand  
opcode target              ; single-operand
```

## Instruction Categories

### Data Movement

| Instruction | Syntax | Description |
|-------------|--------|-------------|
| `mov` | `mov rd, rs` | Copy register to register |
| `movi` | `movi rd, imm` | Load immediate value |
| `load` | `load rd, [rs + off]` | Load from memory |
| `store` | `store [rd + off], rs` | Store to memory |
| `push` | `push rs` | Push register to stack |
| `pop` | `pop rd` | Pop from stack to register |

### Arithmetic

| Instruction | Syntax | Description |
|-------------|--------|-------------|
| `add` | `add rd, rs1, rs2` | rd = rs1 + rs2 |
| `sub` | `sub rd, rs1, rs2` | rd = rs1 - rs2 |
| `mul` | `mul rd, rs1, rs2` | rd = rs1 * rs2 |
| `div` | `div rd, rs1, rs2` | rd = rs1 / rs2 |
| `mod` | `mod rd, rs1, rs2` | rd = rs1 % rs2 |
| `neg` | `neg rd, rs` | rd = -rs |
| `inc` | `inc rd` | rd = rd + 1 |
| `dec` | `dec rd` | rd = rd - 1 |

### Bitwise

| Instruction | Syntax | Description |
|-------------|--------|-------------|
| `and` | `and rd, rs1, rs2` | rd = rs1 & rs2 |
| `or` | `or rd, rs1, rs2` | rd = rs1 \| rs2 |
| `xor` | `xor rd, rs1, rs2` | rd = rs1 ^ rs2 |
| `not` | `not rd, rs` | rd = ~rs |
| `shl` | `shl rd, rs, n` | rd = rs << n |
| `shr` | `shr rd, rs, n` | rd = rs >> n (logical) |
| `sar` | `sar rd, rs, n` | rd = rs >> n (arithmetic) |

### Comparison

| Instruction | Syntax | Description |
|-------------|--------|-------------|
| `cmp` | `cmp rs1, rs2` | Compare, set flags |
| `test` | `test rs1, rs2` | Bitwise AND, set flags |

### Control Flow

| Instruction | Syntax | Description |
|-------------|--------|-------------|
| `jmp` | `jmp label` | Unconditional jump |
| `jeq` | `jeq label` | Jump if equal (Z=1) |
| `jne` | `jne label` | Jump if not equal (Z=0) |
| `jlt` | `jlt label` | Jump if less than |
| `jle` | `jle label` | Jump if less or equal |
| `jgt` | `jgt label` | Jump if greater than |
| `jge` | `jge label` | Jump if greater or equal |
| `call` | `call fn` | Call function |
| `ret` | `ret` | Return from function |

### System

| Instruction | Syntax | Description |
|-------------|--------|-------------|
| `nop` | `nop` | No operation |
| `halt` | `halt` | Stop execution |
| `syscall` | `syscall n` | System call |

## Immediate Values

```basm
movi r0, 42         ; decimal
movi r0, 0x2A       ; hexadecimal
movi r0, 0b101010   ; binary
movi r0, 'A'        ; character (ASCII value)
```

## Addressing Modes

```basm
load r0, [r1]           ; register indirect
load r0, [r1 + 8]       ; register + offset
load r0, [r1 + r2]      ; register + register
load r0, [r1 + r2 * 4]  ; scaled index
```
