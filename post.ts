export interface Post {
	// Internal – required
	title: string;
	draft: boolean;
	id: number;

	// Others
	[key: string]: unknown;
}
