import {Post} from '../post.ts';
import {nanoid} from '../deps.ts';

type postStatus = 'draftPublish' |
	'publish' |
	'unpublish' |
	'update' |
	'delete' |
	'noop';

export const fillPost = (post: Partial<Post>): Post => Object.assign({draft: true, title: 'Untitled', id: nanoid()}, post) as Post;
export const shouldPostBeChecked = (post: Partial<Post>): boolean => fillPost(post).draft;

export const getActionForPost = (post: Partial<Post>): postStatus => {
	post = fillPost(post);

	if (post.modified) {
		if (post.draft) return 'draftPublish';
		if (post.published) return 'update';

		return 'publish';
	}

	if (post.unpublish) return 'unpublish';
	if (post.delete) return 'delete';

	return 'noop';
}
