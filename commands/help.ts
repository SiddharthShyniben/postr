import {Args} from '../deps.ts';
import {helpMessages} from '../utils/help-messages.ts';

const highlight1 = (string: string) => `\u001B[32;1m${string}\u001B[0m`;
const highlight2 = (string: string) => `\u001B[31;1m${string}\u001B[0m`;

const hl = (string: string) => string
	.replace(/\*(.*?)\*/gim, (_match: string, $1: string) => highlight1($1))
	.replace(/_(.*?)_/gim, (_match: string, $1: string) => highlight2($1));

/*
 * Initialize a new postr directory
 */
export function handleHelp({_}: Args) {
	const key: string | number | undefined = _[1] ?? '_default';

	const message = helpMessages[key.toString()];

	if (!message) {
		console.error('fatal: command not found');
		Deno.exit(1);
	}

	console.log(
		hl(
			message
		)
	);
}
