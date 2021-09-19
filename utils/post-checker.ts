import {Post} from '../post.ts';
import {nanoid} from '../deps.ts';

export const fillPost = (post: Partial<Post>): Post => Object.assign({draft: true, title: 'Untitled', id: nanoid()}, post) as Post;
export const shouldPostBeChecked = (post: Partial<Post>): boolean => fillPost(post).draft;

export const isPostModified = (post: Post) => {};
