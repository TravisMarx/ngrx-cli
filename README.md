# ngrx-cli

### A command line interface to generate your base ngrx files

### Usage
From the root of your project, run 
```bash
ngrx-cli [type] [name]
```
[type] is 1 or all of 'actions', 'reducers', 'effects', 'service' or 'all'. Using 'all' is shorthand for the rest, or you can pick and choose the files you wish to generate.

[name] is the name of the item you will generate.

Example commands:

```bash
ngrx-cli all session
```

You can edit configuration options in your project's package.json

```bash
{
	...package,
    "ngrx-cli": {
    	"groupByName": true,
        "rootStore": "src/app/store"
    }
}
```
##### Options
```bash
groupByName: groups your files by name instead of type. Example folder output:
	- store
		-  session
			- session.actions.ts
			- session.effects.ts
			- session.reducers.ts
			- session.service.ts  

rootStore: The directory of your root store. If none is specified, files will go in your app root by default.
```