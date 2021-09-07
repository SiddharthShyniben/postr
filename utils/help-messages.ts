export const helpMessages: {[command: string]: any} = {
	_default: `*postr:* The ultimate blogging tool

Available commands:
  *init*:              Initialize a new postr directory with some default config
  *new* _<schema>_:      Generate new _<schema>_.
                     _<schema>_ can either be the built in _post_ or
                     any others exposed by a plugin
  *refresh*:           The main command to publish/unpublish/update posts and run plugins.
  *help* _<command>+:    Show help for _<command>_. If _<command>_ is not provided,
                     This message will be shown`,
	init: `*postr init:* Initializes the current directory as a postr directory`,
	new: `*postr new* _<schema>:_ Generates a new _<schema>_. A schema is a template for a post`,
	refresh: `*postr refresh:* This is an all in one command for:

               1. Updating any changed posts
               2. Publishing any due posts
               3. Unpublishing any overdue posts

               You will probably want to run *refresh* periodically (maybe on a cron job).`
};
