export interface Post {
	[key: string]: unknown;

	// Internal – required
	title: string;
	draft: boolean;
	id: number;

	modified?: boolean;
	published?: boolean;
	unpublish?: boolean;
	delete?: boolean;
}
