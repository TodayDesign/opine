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

### Multiple entry points and targets

The basic setup above accounts for a single entry point that bundles down to a
single script. If you need multiple entry points, the following configuration
will override the `entry` and `target` configuration values.

```js
opine: {
    scripts: {
        multibundle: [ 
            { entry: 'form-entry.js', target: 'forms.js' },
            'main.js'   // equivalent to { entry: 'main.js', target: 'main.js' }
        ]
    }
}
```

### Babelify

If you want to apply Babelify transforms, configure `opine.scripts.transforms`
to be an array of the names of the presets you want to apply.

```js
opine: {
    scripts: {
        transforms: ['es2015']
    }
}
```

Note that Babelify and its presets are NOT included as dependencies of 
opine-scripts; you will need to install them yourself (for the example above,
you'd need to add the `babelify` and `babel-preset-es2015` packages to your
project).
