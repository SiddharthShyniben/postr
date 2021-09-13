import {Args} from '../deps.ts';
import {helpMessages} from '../utils/help-messages.ts';
import {hl, fail} from '../utils/ui.ts'

/*
 * Initialize a new postr directory
 */
export function handleHelp({_}: Args) {
	const key: string = (_[1] ?? '_default').toString();
	const message = helpMessages[key];

	if (!message) fail('command not found');

	console.log(hl(message));
}
