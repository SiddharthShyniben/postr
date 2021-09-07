import {parseArgs} from './utils/args.ts';

import {handleInit} from './commands/init.ts';
import {handleNew} from './commands/new.ts';
import {handleRefresh} from './commands/refresh.ts';

parseArgs(Deno.args)
	.command('init', handleInit)
	.command('new', handleNew)
	.command('refresh', handleRefresh);
