/**
 * Wasmley - Lua 5.4 runtime compiled to WebAssembly
 */

export interface LuaModule {
  _luaL_newstate(): number;
  _luaL_openselectedlibs(L: number, load: number, preload: number): void;
  _luaL_openpurelibs(L: number): void;
  _luaL_loadstring(L: number, str: number): number;
  _lua_pcallk(L: number, nargs: number, nresults: number, errfunc: number, ctx: number, k: number): number;
  _lua_close(L: number): void;
  _lua_gettop(L: number): number;
  _lua_settop(L: number, idx: number): void;
  _lua_pushstring(L: number, str: number): void;
  _lua_pushnumber(L: number, n: number): void;
  _lua_pushboolean(L: number, b: number): void;
  _lua_pushnil(L: number): void;
  _lua_tolstring(L: number, idx: number, len: number): number;
  _lua_tonumberx(L: number, idx: number, isnum: number): number;
  _lua_toboolean(L: number, idx: number): number;
  _lua_setglobal(L: number, name: number): void;
  _lua_getglobal(L: number, name: number): void;
  _malloc(size: number): number;
  _free(ptr: number): void;
  UTF8ToString(ptr: number): string;
  stringToUTF8(str: string, ptr: number, maxBytes: number): void;
  lengthBytesUTF8(str: string): number;
}

export interface CreateLuaOptions {
  /** Custom print handler */
  print?: (text: string) => void;
  /** Custom error print handler */
  printErr?: (text: string) => void;
  /** Custom path to lua.wasm file */
  wasmPath?: string;
}

export interface RunResult {
  success: boolean;
  error?: string;
}

export class Wasmley {
  lua: LuaModule;
  L: number | null;
  
  constructor(lua: LuaModule);
  
  /** Initialize a new Lua state with all libraries loaded */
  init(): this;
  
  /** Execute Lua code */
  run(code: string): RunResult;
  
  /** Close the Lua state and free resources */
  close(): void;
}

/** Initialize the raw Lua module with optional configuration */
export function createLua(options?: CreateLuaOptions): Promise<LuaModule>;

/** Create a high-level Wasmley instance */
export function create(options?: CreateLuaOptions): Promise<Wasmley>;

/** Raw Emscripten module factory */
export const LuaModuleFactory: (config?: any) => Promise<LuaModule>;
