import {parseArgs} from './utils/args.ts';

import {handleInit} from './commands/init.ts';
import {handleNew} from './commands/new.ts';
import {handleRefresh} from './commands/refresh.ts';

parseArgs(Deno.args, {
		boolean: ['force', 'f'],
		alias: {
			f: 'force',
		}
	}).command('init', handleInit)
		.command('new', handleNew)
		.command('refresh', handleRefresh);
