# Requirements Document

## Introduction

RustScript is a programming language compiler that combines Rust-like syntax and strong type checking with the JavaScript ecosystem. The compiler, built in TypeScript, transpiles `.rusp` source files into optimized JavaScript code. RustScript aims to provide developers with Rust's safety guarantees and expressive syntax while targeting the JavaScript runtime, enabling use in web browsers and Node.js environments.

## Glossary

- **RustScript**: The programming language that combines Rust-like syntax with JavaScript compilation target
- **Compiler**: The TypeScript-based tool that transforms RustScript source code into JavaScript
- **Lexer**: Component that converts source text into a stream of tokens
- **Parser**: Component that converts tokens into an Abstract Syntax Tree (AST)
- **Type Checker**: Component that validates type correctness of the AST
- **Code Generator**: Component that transforms the AST into JavaScript code
- **AST (Abstract Syntax Tree)**: Tree representation of the syntactic structure of source code
- **Token**: Smallest unit of meaning in source code (keywords, identifiers, operators, literals)
- **Source File**: A `.rusp` file containing RustScript source code
- **Transpilation**: The process of converting RustScript source code to JavaScript
- **Type Inference**: Automatic deduction of types without explicit annotations
- **Ownership**: Rust concept tracking which variable owns a value (simplified for RustScript)

## Requirements

### Requirement 1

**User Story:** As a developer, I want to write RustScript code in `.rusp` files, so that I can use Rust-like syntax while targeting JavaScript.

#### Acceptance Criteria

1. WHEN the Compiler receives a file with `.rusp` extension THEN the Compiler SHALL accept the file for processing
2. WHEN the Compiler receives a file without `.rusp` extension THEN the Compiler SHALL reject the file with a clear error message
3. WHEN the Compiler processes a valid `.rusp` file THEN the Compiler SHALL produce a corresponding `.js` output file

### Requirement 2

**User Story:** As a developer, I want the compiler to tokenize my RustScript code, so that the source can be parsed into meaningful units.

#### Acceptance Criteria

1. WHEN the Lexer processes source code THEN the Lexer SHALL identify keywords (let, mut, fn, struct, enum, impl, if, else, while, for, match, return, pub, const, type, trait, use, mod)
2. WHEN the Lexer encounters identifiers THEN the Lexer SHALL recognize valid identifier patterns starting with a letter or underscore followed by alphanumeric characters or underscores
3. WHEN the Lexer encounters numeric literals THEN the Lexer SHALL recognize integer and floating-point number formats
4. WHEN the Lexer encounters string literals THEN the Lexer SHALL recognize double-quoted strings with escape sequence support
5. WHEN the Lexer encounters operators THEN the Lexer SHALL recognize arithmetic (+, -, *, /, %), comparison (==, !=, <, >, <=, >=), logical (&&, ||, !), and assignment (=, +=, -=) operators
6. WHEN the Lexer encounters delimiters THEN the Lexer SHALL recognize parentheses, braces, brackets, commas, colons, semicolons, and arrows (->)
7. WHEN the Lexer encounters whitespace and comments THEN the Lexer SHALL skip whitespace and recognize single-line (//) and multi-line (/* */) comments
8. WHEN the Lexer produces tokens THEN the Lexer SHALL include source location information (line and column) for each token
9. WHEN the Lexer encounters an unrecognized character THEN the Lexer SHALL report an error with the character and its location

### Requirement 3

**User Story:** As a developer, I want the compiler to parse my RustScript code into an AST, so that the code structure can be analyzed and transformed.

#### Acceptance Criteria

1. WHEN the Parser processes tokens THEN the Parser SHALL construct an AST representing the program structure
2. WHEN the Parser encounters a function definition THEN the Parser SHALL parse the function name, parameters with types, return type, and body
3. WHEN the Parser encounters variable declarations THEN the Parser SHALL parse let bindings with optional mutability (mut), type annotations, and initializers
4. WHEN the Parser encounters struct definitions THEN the Parser SHALL parse the struct name and field definitions with types
5. WHEN the Parser encounters enum definitions THEN the Parser SHALL parse the enum name and variant definitions
6. WHEN the Parser encounters expressions THEN the Parser SHALL parse literals, identifiers, binary operations, unary operations, function calls, and member access
7. WHEN the Parser encounters control flow statements THEN the Parser SHALL parse if/else, while, for, and match expressions
8. WHEN the Parser encounters a syntax error THEN the Parser SHALL report the error with location and expected tokens
9. WHEN the Parser completes successfully THEN the Parser SHALL produce a well-formed AST that can be serialized and deserialized
10. WHEN the Parser produces an AST THEN a pretty printer SHALL be able to convert the AST back to valid RustScript source code

### Requirement 4

**User Story:** As a developer, I want the compiler to perform type checking, so that type errors are caught before runtime.

#### Acceptance Criteria

1. WHEN the Type Checker analyzes the AST THEN the Type Checker SHALL verify that all expressions have consistent types
2. WHEN the Type Checker encounters a variable declaration with a type annotation THEN the Type Checker SHALL verify the initializer matches the declared type
3. WHEN the Type Checker encounters a variable declaration without a type annotation THEN the Type Checker SHALL infer the type from the initializer
4. WHEN the Type Checker encounters a function call THEN the Type Checker SHALL verify argument types match parameter types
5. WHEN the Type Checker encounters a function with a return type THEN the Type Checker SHALL verify all return paths return the declared type
6. WHEN the Type Checker encounters binary operations THEN the Type Checker SHALL verify operand types are compatible with the operator
7. WHEN the Type Checker encounters struct field access THEN the Type Checker SHALL verify the field exists and return its type
8. WHEN the Type Checker encounters an assignment to an immutable variable THEN the Type Checker SHALL report a mutability error
9. WHEN the Type Checker detects a type error THEN the Type Checker SHALL report the error with location, expected type, and actual type

### Requirement 5

**User Story:** As a developer, I want the compiler to generate JavaScript code, so that my RustScript programs can run in JavaScript environments.

#### Acceptance Criteria

1. WHEN the Code Generator processes a valid AST THEN the Code Generator SHALL produce syntactically correct JavaScript code
2. WHEN the Code Generator encounters a function definition THEN the Code Generator SHALL emit a JavaScript function declaration
3. WHEN the Code Generator encounters a struct definition THEN the Code Generator SHALL emit a JavaScript class with constructor
4. WHEN the Code Generator encounters an enum definition THEN the Code Generator SHALL emit JavaScript object constants representing variants
5. WHEN the Code Generator encounters let bindings THEN the Code Generator SHALL emit const for immutable and let for mutable variables
6. WHEN the Code Generator encounters match expressions THEN the Code Generator SHALL emit equivalent JavaScript switch statements or if-else chains
7. WHEN the Code Generator produces output THEN the Code Generator SHALL generate readable, properly indented JavaScript code

### Requirement 6

**User Story:** As a developer, I want the compiler to support basic Rust types, so that I can write type-safe code.

#### Acceptance Criteria

1. WHEN the Compiler processes type annotations THEN the Compiler SHALL support primitive types (i32, i64, f32, f64, bool, str, char)
2. WHEN the Compiler processes type annotations THEN the Compiler SHALL support the unit type ()
3. WHEN the Compiler processes type annotations THEN the Compiler SHALL support Option<T> for optional values
4. WHEN the Compiler processes type annotations THEN the Compiler SHALL support Result<T, E> for error handling
5. WHEN the Compiler processes type annotations THEN the Compiler SHALL support Vec<T> for dynamic arrays
6. WHEN the Compiler processes type annotations THEN the Compiler SHALL support user-defined struct and enum types

### Requirement 7

**User Story:** As a developer, I want clear error messages from the compiler, so that I can quickly identify and fix issues in my code.

#### Acceptance Criteria

1. WHEN the Compiler encounters an error THEN the Compiler SHALL display the file name, line number, and column number
2. WHEN the Compiler encounters an error THEN the Compiler SHALL display the relevant source code line with a caret pointing to the error location
3. WHEN the Compiler encounters an error THEN the Compiler SHALL provide a descriptive error message explaining the issue
4. WHEN the Compiler encounters multiple errors THEN the Compiler SHALL report all errors found rather than stopping at the first error
5. WHEN the Compiler encounters a type error THEN the Compiler SHALL suggest possible fixes when applicable

### Requirement 8

**User Story:** As a developer, I want to use the compiler via command line, so that I can integrate it into my build process.

#### Acceptance Criteria

1. WHEN a user invokes the Compiler with a source file path THEN the Compiler SHALL compile the specified file
2. WHEN a user invokes the Compiler with an output flag (-o or --output) THEN the Compiler SHALL write output to the specified path
3. WHEN a user invokes the Compiler with a help flag (-h or --help) THEN the Compiler SHALL display usage information
4. WHEN a user invokes the Compiler with a version flag (-v or --version) THEN the Compiler SHALL display the version number
5. WHEN a user invokes the Compiler without required arguments THEN the Compiler SHALL display an error message with usage hints

### Requirement 9

**User Story:** As a developer, I want the compiler to use tsconfig.json for configuration, so that I can customize compilation behavior.

#### Acceptance Criteria

1. WHEN the Compiler starts THEN the Compiler SHALL look for a tsconfig.json file in the current directory or specified path
2. WHEN the Compiler finds a tsconfig.json THEN the Compiler SHALL read RustScript-specific options from a "rustscript" section
3. WHEN the tsconfig.json specifies an output directory THEN the Compiler SHALL write output files to that directory
4. WHEN the tsconfig.json specifies strict mode THEN the Compiler SHALL enable additional type checking rules
5. IF the tsconfig.json is malformed or missing required fields THEN the Compiler SHALL report a configuration error with details
