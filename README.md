# Opine  :point_up:

Opine is a system for using common gulptasks. This is the core module.

## Usage

Add the following to your `gulpfile.js`.

```js

require('gulp-opine')();

```

Opine does nothing by itself, but once some extra modules are installed it
forms a pretty nice drop-in build system that doesn't require any configuration.

For example, run:

```
npm init
npm install --save-dev gulp-opine-styles gulp-opine-scripts
gulp build
```

Gulp will compile all the sass files in `frontend/styles` into `public/styles/main.css`
(functionality from opine-styles) and compile all the js modules under 
`frontend/scripts` into `public/scripts/main.js` (opine-scripts).

To alter the configuration, run `gulp config-defaults` to see which config
keys are being read, and then set those keys in `config/default.json` (you might
have to create this file yourself if one doesn't exist already -- documentation
for config is available in the [config](https://github.com/lorenwest/node-config)
module.)

## Writing your own modules for opine

A module should read some local configuration and then define a single gulptask.

```js

// First, import opine. Unlike its use in a gulpfile, though, don't call it!
var opine = require('gulp-opine');

// Then define your module. The name of the module tells opine where the 
// specific config for this module is, as well as the default directory
// names to use for sources and destinations.
var module = opine.module('styles');

```

### Read local config

Configurability should be fairly limited, but definitely allow for 
configuration of sources and destinations.

Config variables must be read **outside of the gulp task**. Opine must be able
to read all relevant config without actually running any tasks so that it can
perform diagnostics like identifying which config variables are explicitly 
defined and which are using defaults.

```js

// this will return ['sources/styles/**/*']
var sources = module.getSources();

// this will return ['sources/styles/**/*.scss']
var sources = module.getSources('.scss');

// get destination directory, defaults to 'dest/styles'
var dest = module.getDest();

// module-specific config. make sure to add a sane default wherever possible
var includes = module.getConfig('includes', []);

// indicate that this task should be run as a dependency of the 'build' task
module.addBuild();  

// indicate that this task should run if one of the sources changes
module.addWatch(sources);
```

### Define the task

```js
// now define the actual task as you usually would if it were in a gulpfile
// note that this is identical to gulp.task(module.name, [], function() { ... });
module.task([], function() {
    var sasspipe = sass({
        outputStyle: 'expanded',
        precision: 6,
        includePaths: includes
    })
    .on('error', sass.logError);

    return gulp.src(sources)
        .pipe(sasspipe)
        .pipe(cssnano())
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});

```

Actions like minifying css and including sourcemaps should be governed by
`opine.getConfig('debug')` rather than `module.getConfig('minify')` to avoid 
users having to change a whole bunch of config to set up a production vs debug 
build. 

Extra config that is really required for basic functionality of the module
(for example, include paths, which are needed but different for every project)
should be accessed by `module.getConfig('module.identifier', 'sane default')`.

The whole point of this module is to reduce the amount of boilerplate/setup 
time, so it's okay to be didactic. If a user has a task that really
does need that extra config, they can just write a gulp task themselves.

Tasks should add themselves to the opine build, develop and watch lists as
appropriate, via `module.addBuild`, `module.addDevelop` and 
`module.addWatch` lists respectively. All of the build tasks will be added
as a dependency to `gulp build`, while all of the `develop` tasks will be 
executed (along with the `watch` tasks) as part of `gulp develop`.

