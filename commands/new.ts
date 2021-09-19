import {Args, ensureFile, ensureDir, existsSync, slugify, stringifyToml} from '../deps.ts';
import {fillPost} from '../utils/post-checker.ts';
import {fail} from '../utils/ui.ts';

/*
 * Create a new post
 */
export async function handleNew({_}: Args) {
	const name: string | number | undefined = _[1];

	if (!existsSync('postr.toml')) fail('not a postr directory')
	if (!name) fail('no name was provided');

	const slug = slugify(name.toString());

	if (existsSync(`posts/${slug}`)) fail('post with the same slug exists')

	await ensureFile(`posts/${slug}/post.md`)
	await ensureDir(`posts/${slug}/assets/images`)
	await Deno.writeTextFile(`posts/${slug}/post.md`, `---\n${
		stringifyToml(fillPost({
			title: name.toString(),
		}))
	}\n---\n\n_What amazing things will you write today?_`);
}
