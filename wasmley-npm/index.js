/**
 * Wasmley - Lua 5.4 runtime compiled to WebAssembly
 */

const path = require('path');
const fs = require('fs');

// Re-export the Emscripten module factory
const LuaModuleFactory = require('./lua.js');

/**
 * Initialize Wasmley with optional configuration
 * @param {Object} options - Configuration options
 * @param {Function} options.print - Custom print handler (default: console.log)
 * @param {Function} options.printErr - Custom error print handler (default: console.error)
 * @param {string} options.wasmPath - Custom path to lua.wasm file
 * @returns {Promise<Object>} The initialized Lua module
 */
async function createLua(options = {}) {
  const config = {
    print: options.print || console.log,
    printErr: options.printErr || console.error,
  };

  // Handle custom wasm path for Node.js environments
  if (options.wasmPath) {
    config.locateFile = (filename) => {
      if (filename.endsWith('.wasm')) {
        return options.wasmPath;
      }
      return filename;
    };
  }

  const lua = await LuaModuleFactory(config);
  return lua;
}

/**
 * High-level Lua execution helper
 */
class Wasmley {
  constructor(lua) {
    this.lua = lua;
    this.L = null;
  }

  /**
   * Initialize a new Lua state with all libraries loaded
   */
  init() {
    this.L = this.lua._luaL_newstate();
    if (!this.L) {
      throw new Error('Failed to create Lua state');
    }
    // Open standard libs
    this.lua._luaL_openselectedlibs(this.L, 0xFFFFFFFF, 0);
    // Open embedded pure Lua libs (json, inspect, etc.)
    if (this.lua._luaL_openpurelibs) {
      this.lua._luaL_openpurelibs(this.L);
    }
    return this;
  }

  /**
   * Execute Lua code
   * @param {string} code - Lua code to execute
   * @returns {Object} Result with success status and optional error
   */
  run(code) {
    if (!this.L) {
      this.init();
    }

    const len = this.lua.lengthBytesUTF8(code) + 1;
    const ptr = this.lua._malloc(len);
    this.lua.stringToUTF8(code, ptr, len);

    const loadResult = this.lua._luaL_loadstring(this.L, ptr);
    this.lua._free(ptr);

    if (loadResult !== 0) {
      const errPtr = this.lua._lua_tolstring(this.L, -1, 0);
      const error = this.lua.UTF8ToString(errPtr);
      this.lua._lua_settop(this.L, -2); // pop error
      return { success: false, error: `Syntax Error: ${error}` };
    }

    const execResult = this.lua._lua_pcallk(this.L, 0, 0, 0, 0, 0);

    if (execResult !== 0) {
      const errPtr = this.lua._lua_tolstring(this.L, -1, 0);
      const error = this.lua.UTF8ToString(errPtr);
      this.lua._lua_settop(this.L, -2); // pop error
      return { success: false, error: `Runtime Error: ${error}` };
    }

    return { success: true };
  }

  /**
   * Close the Lua state and free resources
   */
  close() {
    if (this.L) {
      this.lua._lua_close(this.L);
      this.L = null;
    }
  }
}

/**
 * Create a high-level Wasmley instance
 * @param {Object} options - Configuration options
 * @returns {Promise<Wasmley>} Initialized Wasmley instance
 */
async function create(options = {}) {
  const lua = await createLua(options);
  return new Wasmley(lua).init();
}

module.exports = {
  createLua,
  create,
  Wasmley,
  // Also export the raw factory for advanced usage
  LuaModuleFactory
};
