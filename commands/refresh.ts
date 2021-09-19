import {Args, expandGlob, existsSync, parseToml} from '../deps.ts';
import {shouldPostBeChecked} from '../utils/post-checker.ts';
import {fail} from '../utils/ui.ts';

const read = Deno.readTextFile;

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

		const {parsedFrontMatter, contents} = extractFrontMatter(await read(post.path + '/post.md'));
		const adapters = parsedFrontMatter.adapters ?? [];

		if (!parsedFrontMatter) {
			fail('no frontmatter for ' + post.path);
			continue;
		}

		if (!shouldPostBeChecked(parsedFrontMatter)) continue;

		if (!Array.isArray(adapters)) {
			fail('adapters is not an array');
			continue;
		}

		adapters.forEach(async (adapter: string) => {
			const adapterPlugins = parseToml(await read('postr.toml')).adapterPlugins ?? {};

			if (!isObject(adapterPlugins)) {
				fail('adapterPlugins in the configuration is not an object');
				return;
			}

			const adapterPath = adapterPlugins[adapter];

			if (!adapterPath) {
				console.warn('warn: an adapter was set' +
					'but the corresponding plugin was not configured in `postr.toml`. Skipping');
				return;
			}

			if (!('path' in <any>adapterPath)) fail(`adapter ${adapter} does not have a path`);

			import((<any>adapterPath).path)
				.then(async module => await module.publish(contents, parsedFrontMatter, (<any>adapterPath).config))
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

const isObject = (thing: unknown): thing is Record<string, unknown> => Object.prototype.toString.call(thing) === '[object Object]';
