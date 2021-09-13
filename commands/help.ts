import {Args} from '../deps.ts';
import {helpMessages} from '../utils/help-messages.ts';
import {hl, fail} from '../utils/ui.ts'

/*
 * Initialize a new postr directory
 */
export function handleHelp({_}: Args) {
	const key: string | number | undefined = _[1];

	if (!key) {
		console.log(hl(helpMessages._default));
		return;
	}

	if (!(key in helpMessages)) fail('command not found')

	console.log(
		hl(
			// Hacky typing
			getKeyValue(key.toString())(helpMessages)
		)
	);
}

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];
