import {Args, existsSync} from '../deps.ts';

/*
 * Initialize a new postr directory
 */
export function handleInit(argv: Args) {
	const configExists = existsSync('postr.toml');

	if (configExists && !argv.force) {
		console.error('fatal: config already exists. Run with --force to reinitialize');
		Deno.exit(1);
	}

	Deno.writeTextFile('postr.toml', '# Todo');
	console.log((configExists ? 'Rei' : 'I') + 'nitialized postr in ' + Deno.cwd())
}
