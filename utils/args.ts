import {parse, Args, ArgParsingOptions} from '../deps.ts';

export class ArgvParser {
	argv: Args = {_: []};

	constructor(argv: string[], options: ArgParsingOptions = {}) {
		this.argv = parse(argv, options);
	}

	command(name: string, handler: (argv: Args) => void) {
		if (this.argv._[0] === name) {
			handler(this.argv);
		}

		return this;
	}

	defaultCommand(handler: () => void) {
		if (this.argv._.length === 0) {
			handler();
		}

		return this;
	}
}

// Sugar
export function parseArgs(argv: string[], options: ArgParsingOptions = {}) {
	return new ArgvParser(argv, options);
}
