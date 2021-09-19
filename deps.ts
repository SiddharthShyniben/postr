import {parse, Args, ArgParsingOptions} from 'https://deno.land/std@0.106.0/flags/mod.ts';
import {parse as parseToml, stringify as stringifyToml} from 'https://deno.land/std@0.106.0/encoding/toml.ts';
import {existsSync, ensureFile, ensureDir, expandGlob} from 'https://deno.land/std@0.106.0/fs/mod.ts';
import {slugify} from 'https://deno.land/x/slugify@0.3.0/mod.ts';
import {nanoid} from 'https://deno.land/x/nanoid@v3.0.0/mod.ts'

export {parse};
export type {Args, ArgParsingOptions};
export {parseToml, stringifyToml};
export {existsSync, ensureFile, ensureDir, expandGlob};
export {slugify};
export {nanoid}

// Not a dep
export const VERSION = '0.0.0';
