# BASM Memory Model

## Memory Layout

```
+------------------+ 0xFFFFFFFF...
|     Stack        | (grows down)
|        ↓         |
+------------------+
|                  |
|    Free Space    |
|                  |
+------------------+
|        ↑         |
|      Heap        | (grows up)
+------------------+
|      Data        | (initialized globals)
+------------------+
|       BSS        | (uninitialized globals)
+------------------+
|      Code        | (read-only)
+------------------+ 0x00000000

```

## Sections

### Code Section

```basm
section .code
    fn main() {
        ; executable code
    }
```

### Data Section

```basm
section .data
    message: db "Hello, World!", 0
    count: dq 42
    buffer: times 256 db 0
```

### BSS Section

```basm
section .bss
    temp: resq 1        ; reserve 1 quadword
    array: resb 1024    ; reserve 1024 bytes
```

## Data Directives

| Directive | Size | Description |
|-----------|------|-------------|
| `db` | 1 byte | Define byte |
| `dw` | 2 bytes | Define word |
| `dd` | 4 bytes | Define doubleword |
| `dq` | 8 bytes | Define quadword |
| `resb` | 1 byte | Reserve bytes |
| `resw` | 2 bytes | Reserve words |
| `resd` | 4 bytes | Reserve doublewords |
| `resq` | 8 bytes | Reserve quadwords |

## Memory Access

### Load Operations

```basm
load.b r0, [r1]     ; load byte (zero-extend)
load.bs r0, [r1]    ; load byte (sign-extend)
load.w r0, [r1]     ; load word
load.d r0, [r1]     ; load doubleword
load r0, [r1]       ; load quadword (default)
```

### Store Operations

```basm
store.b [r0], r1    ; store byte
store.w [r0], r1    ; store word
store.d [r0], r1    ; store doubleword
store [r0], r1      ; store quadword (default)
```

## Alignment

```basm
section .data
    align 8
    aligned_value: dq 0x1234567890ABCDEF
    
    align 16
    simd_data: times 4 dq 0
```

## Stack Operations

```basm
; Manual stack management
sub sp, sp, 32      ; allocate 32 bytes
store [sp], r0      ; save to stack
load r0, [sp + 8]   ; load from stack
add sp, sp, 32      ; deallocate

; Convenience instructions
push r0             ; sp -= 8; [sp] = r0
pop r0              ; r0 = [sp]; sp += 8
```

## Memory Ordering

BASM assumes sequential consistency by default. For explicit ordering:

```basm
fence               ; full memory barrier
fence.r             ; read barrier
fence.w             ; write barrier
fence.rw            ; read-write barrier
```
