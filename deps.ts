import {parse, Args, ArgParsingOptions} from "https://deno.land/std@0.106.0/flags/mod.ts";
import {parse as parseToml, stringify as stringifyToml} from "https://deno.land/std@0.106.0/encoding/toml.ts";
import {existsSync} from "https://deno.land/std@0.106.0/fs/mod.ts";

export {parse};
export type {Args, ArgParsingOptions};
export {parseToml, stringifyToml};
export {existsSync}
