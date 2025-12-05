# LibTerm

A Termux package manager for ethical hacking and utility tools, written in pure C.

## Features

- Interactive menu with ANSI color-coded tool status
- On-demand tool compilation
- Automatic PATH management
- No root/sudo required

## Tools Included

1. **JSON Parser** - Format, minify, and validate JSON
2. **Network Scanner** - Scan networks for alive hosts
3. **Hash Cracker** - Crack and generate MD5/SHA1/SHA256 hashes
4. **Port Scanner** - TCP port scanning
5. **Base64 Tool** - Encode/decode base64
6. **Hex Dump** - Hexadecimal file viewer

## Installation

```bash
make
make install
./bin/libterm
```

## Usage

Run the main menu:
```bash
./bin/libterm
```

Activate tools from the menu to compile and add them to your PATH.

## Building on macOS (for testing)

This project is designed for Termux but can be compiled on macOS for testing:

```bash
make
```

Note: Some tools may require OpenSSL (`brew install openssl`)

## License

MIT
