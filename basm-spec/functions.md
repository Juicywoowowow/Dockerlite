# BASM Functions

## Function Declaration

Functions are first-class constructs in BASM, not just labels.

### Basic Syntax

```basm
fn name(params) -> returns {
    ; function body
    ret
}
```

### Examples

```basm
; No parameters, no return
fn init() {
    movi r0, 0
    ret
}

; Single parameter, single return
fn double(r0) -> r0 {
    add r0, r0, r0
    ret
}

; Multiple parameters
fn add(r0, r1) -> r0 {
    add r0, r0, r1
    ret
}

; Multiple returns (via registers)
fn divmod(r0, r1) -> r0, r1 {
    mov r2, r0
    div r0, r2, r1
    mod r1, r2, r1
    ret
}
```

## Calling Convention

### Parameter Passing

| Parameter | Register |
|-----------|----------|
| 1st | `r0` / `arg0` |
| 2nd | `r1` / `arg1` |
| 3rd | `r2` / `arg2` |
| 4th | `r3` / `arg3` |
| 5th+ | Stack (right to left) |

### Return Values

- Primary return: `r0`
- Secondary return: `r1`
- Additional returns: Stack

### Stack Frame

```
+------------------+
| Return Address   | <- pushed by call
+------------------+
| Saved FP         | <- optional
+------------------+
| Local Variables  |
+------------------+
| Saved Registers  |
+------------------+ <- SP
```

## Function Attributes

### Export

```basm
export fn main() {
    ; visible to linker
}
```

### Inline

```basm
inline fn min(r0, r1) -> r0 {
    cmp r0, r1
    jle .done
    mov r0, r1
.done:
    ret
}
```

### Naked

```basm
naked fn interrupt_handler() {
    ; no prologue/epilogue generated
    ; manual register saving required
}
```

## Local Labels

Labels within functions are prefixed with `.` and are scoped to that function:

```basm
fn abs(r0) -> r0 {
    cmp r0, 0
    jge .positive
    neg r0, r0
.positive:
    ret
}
```

## Tail Calls

```basm
fn factorial_tail(r0, r1) -> r0 {
    cmp r0, 1
    jle .base
    mul r1, r1, r0
    dec r0
    tailcall factorial_tail  ; optimized tail recursion
.base:
    mov r0, r1
    ret
}
```
