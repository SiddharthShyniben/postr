import {existsSync, parseToml, stringifyToml} from './deps.ts';

export function getConfig() {
	return ifConfigExists(() => parseToml(await Deno.readTextFile('postr.toml')));
}

export function setConfig(config) {
	return ifConfigExists(() => Deno.writeTextFile('postr.toml', stringifyToml(config)));
}

function ifConfigExists(action: (...args: any) => any) {
	const configExists = existsSync('postr.toml');

	if (configExists) {
		return action();
	} else throw new Error('fatal: not a postr directory');
}
