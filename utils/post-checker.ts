import {Post} from '../post.ts';
import {nanoid} from '../deps.ts';

export const fillPost = (post: Partial<Post>) => Object.assign({draft: true, title: 'Untitled', id: nanoid()}, post)
export const shouldPostBeChecked = (post: Partial<Post>) => fillPost(post).draft;

export const isPostModified = (post: Post) => {

};
