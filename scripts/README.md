opine-scripts
=====

This module compiles javascript through browserify. 

## Installation:

```
yarn add gulp gulp-opine opine-scripts
```

## Configuration:

Reminder: with opine you can run `gulp config-defaults` to print out the current
values of all configuration values that haven't been explicitly defined.

- `opine.scripts.source`: the directory containing the entry file. Any file 
    being changed in this directory or its children will trigger a rebuild.
- `opine.scripts.entry`: the name of the entry file.
- `opine.scripts.dest`: the directory to save the output .js file
- `opine.scripts.target`: the filename of the compiled .js file in the destination directory

Note that the filesystem watch functionality just monitors for any modification
of _any_ file in the source tree rather than intelligently monitoring files that
have been `require`d. Originally this module was written to use [watchify](https://github.com/substack/watchify)
but we encountered issues with linux incompatibility and decided to switch this
module over to use the same watch as the rest of the opine ecosystem.

Also note that currently this module does not support browserify transforms. 
This is a planned feature but not a high priority one as we currently don't 
make much use of browserify transforms at Thick. Pull requests are welcome if
you'd like to expedite this (or any) feature!
