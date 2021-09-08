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

		if (existsSync(slug)) {
			console.error('fatal: post with the same slug exists.')
			Deno.exit(1);
		}

		ensureFile(`${slug}/post.md`)
			.then(() => ensureDir(`${slug}/assets/images`))
			.then(() => Deno.writeTextFile(`${slug}/post.md`, `---\ntitle: ${name}\n---\n\n_What amazing things will you write today?_`));
	} else {
		console.error('fatal: no name was provided');
		Deno.exit(1);
	}
}
