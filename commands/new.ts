import {Args, ensureFile, ensureDir, existsSync, slugify} from '../deps.ts';

/*
 * Create a new post
 */
export async function handleNew({_}: Args) {
	const name: string | number | undefined = _[1];

	if (!existsSync('postr.toml')) {
		console.error('fatal: not a postr directory');
		Deno.exit(1);
	}

	if (!name) {
		console.error('fatal: no name was provided');
		Deno.exit(1);
	}

	const slug = slugify(name.toString());

	if (existsSync(`posts/${slug}`)) {
		console.error('fatal: post with the same slug exists.');
		Deno.exit(1);
	}

	await ensureFile(`posts/${slug}/post.md`)
	await ensureDir(`posts/${slug}/assets/images`)
	await Deno.writeTextFile(`posts/${slug}/post.md`, `---\ntitle: ${name}\n---\n\n_What amazing things will you write today?_`);
}
