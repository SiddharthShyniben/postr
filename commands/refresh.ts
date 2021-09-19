import {Args, expandGlob, existsSync, parseToml} from '../deps.ts';
import {fail} from '../utils/ui.ts';

/*
 * Refresh (publish all due posts, unpublish all other, run plugins)
 */
export async function handleRefresh(_argv: Args) {
	if (!existsSync('postr.toml')) fail('not a postr directory')

	const posts = expandGlob('posts/*');
	for await (const post of posts) {
		if (!post.isDirectory) {
			console.warn('warning: non-folder found in posts directory')
			continue;
		}

		const {parsedFrontMatter, contents} = extractFrontMatter(await Deno.readTextFile(post.path + '/post.md'));

		const adapters = parsedFrontMatter.adapters ?? [];

		if (!Array.isArray(adapters)) fail('adapters is not an array');
		else adapters.forEach(async (adapter: string) => {

			let {adapterPlugins} = parseToml(await Deno.readTextFile('postr.toml'));

			adapterPlugins ??= {};

			if (!isObject(adapterPlugins)) fail('adapterPlugins in the configuration is not an object');

			const adapterPath = (adapterPlugins as any)[adapter];

			if (!adapterPath) {
				console.warn('warn: an adapter was set' +
					'but the corresponding plugin was not configured in `postr.toml`. Skipping');
				return;
			}

			import(adapterPath.path)
				.then(async module => await module.publish(contents, parsedFrontMatter, adapterPath.config))
				.catch(err => fail(`could not run adapter because of ${err.name}: ${err.message}`));

			// TODO diagonstics
		});
	}
}

function extractFrontMatter(contents: string): {parsedFrontMatter: Record<string, unknown>, contents: string} | never {
	const frontMatterRegex = /^---$([\s\S]+?)^---$/gim;
	const frontMatter = frontMatterRegex.exec(contents) ?? [];

	if (!frontMatter[1]) fail('frontmatter is empty');

	let parsedFrontMatter: Record<string, unknown> | undefined;

	try {
		parsedFrontMatter = parseToml(frontMatter[1]);
	} catch (parseError) {
		return fail('TOML Parse Error: ' + parseError);
	}

	return {parsedFrontMatter, contents: contents.replace(frontMatterRegex, '')}
}

const isObject = (thing: unknown) => Object.prototype.toString.call(thing) === '[object Object]';
