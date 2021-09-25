import {Post} from '../post.ts';
import {nanoid} from '../deps.ts';

export type postStatus =
	'publish' |
	'update' |
	'noop';

export const fillPost = (post: Partial<Post>): Post => Object.assign({
	draft: true, title: 'Untitled', id: nanoid()
}, post) as Post;

export const shouldPostBeChecked = (post: Partial<Post>): boolean => fillPost(post).draft;

export const getActionForPost = (post: Partial<Post>): postStatus => {
	post = fillPost(post);

	if (post.modified) {
		if (post.published) return 'update';

		return 'publish';
	}

	return 'noop';
}

export const isValidFrontMatter = (matter: Partial<Post>) => matter.id && matter.title
