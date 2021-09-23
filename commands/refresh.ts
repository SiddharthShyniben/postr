import {
	Args,
	expandGlob, existsSync,
	parseToml, stringifyToml
} from '../deps.ts';
import {getActionForPost} from '../utils/post-checker.ts';
import {addMapping} from '../utils/db.ts';
import {fail} from '../utils/ui.ts';

const read = Deno.readTextFile;

/*
 * Refresh (run adapters)
 */
export async function handleRefresh(_argv: Args) {
	if (!existsSync('postr.toml')) {
		fail('not a postr directory');
	}

	const posts = expandGlob('posts/*');

	for await (const post of posts) {
		console.log('Checking post ', post.path)
		if (!post.isDirectory) {
			console.warn('warning: non-folder found in posts directory');
			continue;
		}

		let {parsedFrontMatter, contents} = extractFrontMatter(await read(post.path + '/post.md'));
		const adapters = parsedFrontMatter.adapters ?? [];

		if (!parsedFrontMatter) {
			fail('no frontmatter for ' + post.path);
			continue;
		}

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

			if (!('path' in <any>adapterPath)) {
				fail(`adapter ${adapter} does not have a path`);
			}

			import((<any>adapterPath).path)
				.then(async module => {
					const action = getActionForPost(parsedFrontMatter);
					console.log(`${action}ing ${post.path.split('/').pop()}`)

					if (module[action]) {
						await module[action](contents, parsedFrontMatter, (<any>adapterPath).config, {
							updateFrontMatter(newData: {[x: string]: any}) {
								parsedFrontMatter = Object.assign(parsedFrontMatter, newData);
							},
							mapID(remote: string | number) {
								addMapping(parsedFrontMatter.id as string, remote.toString(), adapter);
							}
						})
					} else {
						console.warn(`Adapter ${adapter} does not support action \`${action}\``);
					}

					const finalFrontMatter = stringifyToml(parsedFrontMatter);
					const finalContents = [
						`---`,
						finalFrontMatter,
						`---`,
						'',
						contents
					].join('\n');

					Deno.writeTextFile(post.path + '/post.md', finalContents);
				})
				.catch(error => fail(`could not run adapter because of ${error.name}: ${error.message}`));
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

const isObject = (thing: unknown): thing is Record<string, unknown> => Object.prototype.toString.call(thing) === '[object Object]';
