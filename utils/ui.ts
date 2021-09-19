export const fail = (why: string) => {
	console.error(`\u001B[31;1mfatal\u001B[0m ${why}`);
	Deno.exit(1);
};

export const highlight1 = (string: string) => `\u001B[32;1m${string}\u001B[0m`;
export const highlight2 = (string: string) => `\u001B[31;1m${string}\u001B[0m`;

export const hl = (string: string) => string
	.replace(/\*(.*?)\*/gim, (_match: string, $1: string) => highlight1($1))
	.replace(/_(.*?)_/gim, (_match: string, $1: string) => highlight2($1));
