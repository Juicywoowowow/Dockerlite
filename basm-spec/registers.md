# BASM Registers

## Register Set

BASM defines a fixed set of 16 general-purpose registers plus special-purpose registers.

### General Purpose Registers

| Register | Alias | Convention | Description |
|----------|-------|------------|-------------|
| `r0` | `ret` | Caller-saved | Return value / scratch |
| `r1` | `arg0` | Caller-saved | First argument / scratch |
| `r2` | `arg1` | Caller-saved | Second argument / scratch |
| `r3` | `arg2` | Caller-saved | Third argument / scratch |
| `r4` | `arg3` | Caller-saved | Fourth argument / scratch |
| `r5` | - | Caller-saved | Scratch register |
| `r6` | - | Caller-saved | Scratch register |
| `r7` | - | Caller-saved | Scratch register |
| `r8` | - | Callee-saved | Preserved register |
| `r9` | - | Callee-saved | Preserved register |
| `r10` | - | Callee-saved | Preserved register |
| `r11` | - | Callee-saved | Preserved register |
| `r12` | - | Callee-saved | Preserved register |
| `r13` | `fp` | Callee-saved | Frame pointer |
| `r14` | `lr` | Special | Link register |
| `r15` | `sp` | Special | Stack pointer |

### Special Registers

| Register | Description |
|----------|-------------|
| `pc` | Program counter (read-only) |
| `flags` | Status flags (zero, carry, overflow, negative) |

## Register Discipline Rules

### Caller-Saved (Volatile)

Registers `r0`-`r7` may be modified by any function call. The caller must save these if their values are needed after a call.

### Callee-Saved (Non-Volatile)

Registers `r8`-`r13` must be preserved across function calls. If a function uses these, it must save and restore them.

### Special Handling

- `sp` must always point to valid stack memory
- `lr` is set automatically by `call` instruction
- `fp` usage is optional but recommended for debugging

## Register Width

All registers are 64-bit by default. Sub-register access is available:

```basm
mov r0.b, 0xFF      ; low 8 bits
mov r0.w, 0xFFFF    ; low 16 bits  
mov r0.d, 0xFFFFFFFF ; low 32 bits
mov r0, 0x...       ; full 64 bits
```

## Flags Register

| Bit | Name | Set When |
|-----|------|----------|
| 0 | Z (Zero) | Result is zero |
| 1 | C (Carry) | Unsigned overflow |
| 2 | V (Overflow) | Signed overflow |
| 3 | N (Negative) | Result is negative |
