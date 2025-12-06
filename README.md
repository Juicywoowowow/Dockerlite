# 🌙 Wasmley

**The official Lua runtime compiled to WebAssembly** — run Lua in the browser at near-native speed.

Named after Roberto Ierusalimschy, the creator of Lua (with a WASM twist).

---

## Why Wasmley?

There are several ways to run Lua in the browser. Here's how Wasmley compares:

| Feature | Wasmley | Fengari | Server-Side |
|---------|---------|---------|-------------|
| **Runtime** | Official PUC-Rio Lua (C → WASM) | Lua reimplemented in JS | Lua on server |
| **Performance** | ⚡ Near-native (WASM) | 🐢 ~3-10x slower (JS overhead) | ⚡ Native |
| **Compatibility** | ✅ 100% Lua 5.4 | ⚠️ ~95% (some edge cases) | ✅ 100% |
| **Offline** | ✅ Fully client-side | ✅ Fully client-side | ❌ Requires server |
| **Latency** | ✅ Zero network latency | ✅ Zero network latency | ❌ Network round-trip |
| **C Libraries** | ✅ Can compile C modules | ❌ JS only | ✅ Full access |
| **Bundle Size** | ~150KB gzipped | ~200KB gzipped | N/A |
| **Startup** | Fast (WASM streaming) | Instant (JS) | Depends on server |

### When to use Wasmley

- **Game scripting** — Lua is the industry standard for game modding
- **Embedded scripting** — Let users write Lua in your web app
- **Educational tools** — Teach Lua without server infrastructure
- **Offline-first apps** — No server dependency
- **Performance-critical** — When Fengari's JS overhead matters

### When to use Fengari

- You need deep JS interop (Fengari has seamless JS ↔ Lua)
- Bundle size is critical and you don't need full compatibility
- You're already in a pure JS ecosystem

### When to use Server-Side

- You need filesystem/network access
- Security isolation is critical (sandboxed server environment)
- You're running long computations that would block the browser

---

## Features

- ✅ **Full Lua 5.4** — The real PUC-Rio implementation
- ✅ **Standard Library** — string, table, math, coroutine, utf8, debug, os, io
- ✅ **Embedded Pure Lua Libraries** — Pre-bundled and ready to `require()`
- ✅ **Streaming Compilation** — WASM compiles while downloading
- ✅ **Memory Growth** — Dynamic memory allocation

### Embedded Libraries

These pure Lua libraries are bundled and available via `require()`:

| Library | Description |
|---------|-------------|
| `json` | JSON encoder/decoder (rxi/json.lua) |
| `inspect` | Human-readable table dumps (kikito/inspect.lua) |
| `serpent` | Serializer/pretty-printer (pkulchenko/serpent) |
| `classic` | Tiny OOP library (rxi/classic) |
| `middleclass` | Full-featured OOP (kikito/middleclass) |
| `pl.utils` | Penlight utilities |
| `pl.tablex` | Extended table functions |
| `pl.stringx` | Extended string functions |
| `pl.path` | Path manipulation |
| `pl.pretty` | Pretty printing |

---

## Quick Start

### 1. Include the files

```html
<script src="lua.js"></script>
```

### 2. Initialize and run Lua

```javascript
const lua = await LuaModule({
  print: (text) => console.log(text),
  printErr: (text) => console.error(text)
});

// Create a new Lua state
const L = lua._luaL_newstate();
lua._luaL_openselectedlibs(L, 0xFFFFFFFF, 0);  // Open standard libs
lua._luaL_openpurelibs(L);  // Open embedded pure Lua libs

// Run some Lua code
const code = `
  local json = require("json")
  print(json.encode({hello = "world"}))
`;

const len = lua.lengthBytesUTF8(code) + 1;
const ptr = lua._malloc(len);
lua.stringToUTF8(code, ptr, len);

lua._luaL_loadstring(L, ptr);
lua._lua_pcallk(L, 0, 0, 0, 0, 0);

lua._free(ptr);
lua._lua_close(L);
```

---

## Building from Source

### Prerequisites

- [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) (emcc)
- Python 3
- Git

### Build Steps

```bash
# 1. Clone Lua source
git clone https://github.com/lua/lua.git lua-src --depth 1

# 2. Clone pure Lua libraries
cd lua-src/wasm-purelibs
git clone --depth 1 https://github.com/rxi/json.lua.git json
git clone --depth 1 https://github.com/kikito/inspect.lua.git inspect
git clone --depth 1 https://github.com/pkulchenko/serpent.git serpent
git clone --depth 1 https://github.com/rxi/classic.git classic
git clone --depth 1 https://github.com/kikito/middleclass.git middleclass
git clone --depth 1 https://github.com/lunarmodules/Penlight.git penlight
cd ../..

# 3. Generate embedded libraries C file
python3 lua-src/wasm-purelibs/build_purelibs.py

# 4. Compile to WebAssembly
emcc -O3 \
  lua-src/*.c \
  lua-src/wasm-purelibs/purelibs.c \
  -I lua-src \
  -s WASM=1 \
  -s EXPORT_ALL=1 \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString","stringToUTF8","lengthBytesUTF8"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='LuaModule' \
  -o lua.js
```

### Adding More Libraries

1. Clone the library into `lua-src/wasm-purelibs/`
2. Add an entry to `LIBRARIES` in `build_purelibs.py`
3. Re-run `python3 build_purelibs.py`
4. Recompile with emcc

---

## API Reference

### Core Functions

| Function | Description |
|----------|-------------|
| `_luaL_newstate()` | Create a new Lua state |
| `_luaL_openselectedlibs(L, load, preload)` | Open standard libraries |
| `_luaL_openpurelibs(L)` | Open embedded pure Lua libraries |
| `_luaL_loadstring(L, str)` | Load a Lua chunk from string |
| `_lua_pcallk(L, nargs, nresults, errfunc, ctx, k)` | Protected call |
| `_lua_close(L)` | Close a Lua state |

### Stack Operations

| Function | Description |
|----------|-------------|
| `_lua_gettop(L)` | Get stack top index |
| `_lua_settop(L, idx)` | Set stack top |
| `_lua_pushstring(L, str)` | Push string onto stack |
| `_lua_pushnumber(L, n)` | Push number onto stack |
| `_lua_pushboolean(L, b)` | Push boolean onto stack |
| `_lua_pushnil(L)` | Push nil onto stack |
| `_lua_tolstring(L, idx, len)` | Get string from stack |
| `_lua_tonumberx(L, idx, isnum)` | Get number from stack |
| `_lua_toboolean(L, idx)` | Get boolean from stack |

### Globals

| Function | Description |
|----------|-------------|
| `_lua_setglobal(L, name)` | Pop and set as global |
| `_lua_getglobal(L, name)` | Push global onto stack |

---

## File Sizes

| File | Raw | Gzipped |
|------|-----|---------|
| `lua.wasm` | ~630KB | ~150KB |
| `lua.js` | ~142KB | ~35KB |

---

## License

- Wasmley build scripts: MIT
- Lua: MIT (PUC-Rio)
- Embedded libraries: See individual library licenses

---

## Credits

- [Lua](https://www.lua.org/) by Roberto Ierusalimschy, Waldemar Celes, and Luiz Henrique de Figueiredo
- [Emscripten](https://emscripten.org/) for the C → WASM toolchain
- All the amazing pure Lua library authors

---

*"Lua" means "moon" in Portuguese. Wasmley brings the moon to the web.* 🌙
