import {existsSync, parseToml, stringifyToml} from './deps.ts';

export function getConfig() {
	return ifConfigExists(() => parseToml(await Deno.readTextFile('postr.toml').trim()));
}

export function setConfig(config: Record<any, any>) {
	return ifConfigExists(() => Deno.writeTextFile('postr.toml', stringifyToml(config)));
}

function ifConfigExists(action: (...args: unknown[]) => unknown): unknown {
	const configExists = existsSync('postr.toml');

	if (configExists) {
		return action();
	}

	throw new Error('fatal: not a postr directory');
}
