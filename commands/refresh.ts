import {
	expandGlob, existsSync,
	parseToml, stringifyToml
} from '../deps.ts';

import {getActionForPost, isValidFrontMatter} from '../utils/post-checker.ts';
import {addMapping, getMapping} from '../utils/db.ts';
import {fail} from '../utils/ui.ts';

const read = Deno.readTextFile;

/*
 * Refresh (run adapters)
 */
export async function handleRefresh() {
	if (!existsSync('postr.toml')) {
		fail('not a postr directory');
	}

	const posts = expandGlob('posts/*');

	for await (const post of posts) {

		if (!post.isDirectory) {
			console.warn('warning: non-folder found in posts directory');
			continue;
		}

		let {parsedFrontMatter, contents} = extractFrontMatter(await read(post.path + '/post.md'));
		const adapters = parsedFrontMatter.adapters ?? [];

		if (!parsedFrontMatter) {
			console.warn(`no frontmatter for ${post.path}. Skipping`);
			continue;
		}

		if (!Array.isArray(adapters)) {
			console.warn(`adapters is not an array in post ${post.path}. Skipping`);
			continue;
		}

		if (!isValidFrontMatter(parsedFrontMatter)) {
			console.log(`frontmatter is not valid in post ${post.path}. Skipping`);
			continue;
		}

		adapters.forEach(async (adapter: string) => {
			const adapterPlugins = parseToml(await read('postr.toml')).adapterPlugins ?? {};

			if (!isObject(adapterPlugins)) {
				return fail('adapterPlugins in the configuration is not an object');
			}

			const adapterPath = adapterPlugins[adapter];

			if (!adapterPath) {
				console.warn('warn: an adapter was set' +
					'but the corresponding plugin was not configured in `postr.toml`. Skipping');
				return;
			}

			if (!('path' in <any>adapterPath)) {
				return fail(`adapter ${adapter} does not have a path`);
			}

			// Main action happens here
			import((<any>adapterPath).path)
				.then(async module => {
					const action = getActionForPost(parsedFrontMatter);

					if (module[action]) {
						const handler = {
							updateFrontMatter(newData: {[x: string]: any}) {
								parsedFrontMatter = Object.assign(parsedFrontMatter, newData);
							},
							mapID(remote: string | number) {
								addMapping(parsedFrontMatter.id as string, remote.toString(), adapter);
							}
						}

						if (action === 'update') {
							await module.update(
								contents,
								parsedFrontMatter,
								(<any>adapterPath).config,
								handler,
								await getMapping((<any>parsedFrontMatter).id)
							);
						} else await module[action](contents, parsedFrontMatter, (<any>adapterPath).config, handler);
					} else {
						return console.warn(`Adapter ${adapter} does not support action \`${action}\``);
					}

					writeFinalContents(parsedFrontMatter, contents, post.path)
				})
				.catch(error => fail(`could not run adapter because of ${error}`));
		});
	}
}

function extractFrontMatter(contents: string): {parsedFrontMatter: Record<string, unknown>; contents: string} | never {
	const frontMatterRegex = /^---$([\s\S]+?)^---$/gim;
	const frontMatter = frontMatterRegex.exec(contents) ?? [];

	if (!frontMatter[1]) {
		fail('frontmatter is empty');
	}

	let parsedFrontMatter: Record<string, unknown> | undefined;

	try {
		parsedFrontMatter = parseToml(frontMatter[1]);
	} catch (parseError) {
		return fail('TOML Parse Error: ' + parseError);
	}

	return {parsedFrontMatter, contents: contents.replace(frontMatterRegex, '')};
}

function writeFinalContents(frontMatter: any, contents: string, path: string) {
	const finalFrontMatter = stringifyToml(frontMatter);
	const finalContents = [
		`---`,
		finalFrontMatter,
		`---`,
		'',
		contents
	].join('\n');

	Deno.writeTextFile(path + '/post.md', finalContents);
}

const isObject = (thing: unknown): thing is Record<string, unknown> => Object.prototype.toString.call(thing) === '[object Object]';
