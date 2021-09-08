import {Args, existsSync, ensureFile, ensureDir} from '../deps.ts';

/*
 * Initialize a new postr directory
 */
export async function handleInit({force}: Args) {
	const configExists: boolean = existsSync('postr.toml');

	if (configExists && !force) {
		console.error('fatal: config already exists. Run with --force to reinitialize');
		Deno.exit(1);
	}

	await Deno.writeTextFile('postr.toml', '# Todo');

	await ensureFile('includes/sample.md')
	await ensureDir('posts')

	await Deno.writeTextFile('includes/sample.md', `This is an include. You can include the contents of this file
in a post by using \`{% include sample.md %}\`.

You can use this for recurring stuff like CTAs or social profile links.`);

	console.log(`${configExists ? 'Rei' : 'I'}nitialized postr in ${Deno.cwd()}`);
}
