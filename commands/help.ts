import {Args} from '../deps.ts';
import {helpMessages} from '../utils/help-messages.ts';

const highlight1 = (str: string) => `\u001b[32;1m${str}\u001b[0m`;
const highlight2 = (str: string) => `\u001b[31;1m${str}\u001b[0m`;

const hl = (str: string) => str
	.replace(/\*(.*?)\*/gim, (_match: string, $1: string) => highlight1($1))
	.replace(/_(.*?)_/gim, (_match: string, $1: string) => highlight2($1))

/*
 * Initialize a new postr directory
 */
export function handleHelp(argv: Args) {
	const key: string = (argv._[1] ?? '_default').toString();
	const message = helpMessages[key];
	console.log(
		hl(
			message ?? '%2Command not found!%'
		)
	);
}
