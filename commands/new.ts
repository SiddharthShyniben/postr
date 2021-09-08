import {Args, ensureFile, ensureDir, existsSync, slugify} from '../deps.ts';

/*
 * Create a new post
 */
export function handleNew(argv: Args) {
	const name = argv._[1];

	if (!existsSync('postr.toml')) {
		console.error('fatal: not a postr directory');
		Deno.exit(1);
	}

	if (name) {
		const slug = slugify(name.toString());

		ensureFile(`${slug}/post.md`);
		ensureDir(`${slug}/assets/images`);
		Deno.writeTextFile(`${slug}/post.md`, `---\ntitle: ${name}---\n\n_What amazing things will you write today?_`)
	} else {
		console.error('fatal: no name was provided');
		Deno.exit(1);
	}
}
