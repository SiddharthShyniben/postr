import {Args} from '../deps.ts';
import {helpMessages} from '../utils/help-messages.ts';
import {hl, fail} from '../utils/ui.ts'

/*
 * Initialize a new postr directory
 */
export function handleHelp({_}: Args) {
	const key: string | number | undefined = _[1] ?? '_default';
	const message = helpMessages[key.toString()];

	if (!message) fail('command not found');

	console.log(
		hl(message)
	);
}
