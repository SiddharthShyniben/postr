import {parseArgs} from './utils/args.ts';
import {VERSION} from './deps.ts';

import {handleInit} from './commands/init.ts';
import {handleHelp} from './commands/help.ts';
import {handleNew} from './commands/new.ts';
import {handleRefresh} from './commands/refresh.ts';

parseArgs(Deno.args, {
	boolean: ['force', 'f'],
	alias: {
		f: 'force'
	}
}).defaultCommand(() => {
	console.log('postr ' + VERSION);
	console.log('Run `postr help` to view the help');
}).command('init', handleInit)
	.command('help', handleHelp)
	.command('new', handleNew)
	.command('refresh', handleRefresh);
