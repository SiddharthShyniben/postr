import {Args, existsSync, ensureDir} from '../deps.ts';

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
	ensureDir('includes');
	Deno.writeTextFile('includes/sample.md', `This is an include. You can include the contents of this file
in a post by using \`{% include sample.md %}\`.

You can use this for recurring stuff like CTAs or social profile links.`);

	console.log((configExists ? 'Rei' : 'I') + 'nitialized postr in ' + Deno.cwd())
}
