# Opine  :point_up:

Opine is a system for using common gulptasks. This is the core module.

## Installation

Add the following to your `gulpfile.js`.

```js

require('gulp-opine')();

```

## Usage

Three tasks are included that can be run using `gulp`, `gulp build` and
`gulp develop`. 

## Writing modules

A module should perform a single task.

```js

// First, import opine. Unlike its use in a gulpfile, though, don't call it!
var opine = require('gulp-opine');

// Then define your module. The name of the module tells opine where the 
// specific config for this module is, as well as the default directory
// names to use for sources and destinations.
var module = opine.module('styles');

```

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
        .pipe(postcss([

        ])
        .pipe(cssnano())
        .pipe(gulp.dest(dest))
        .pipe(module.size());
});

```

Actions like minifying css and including sourcemaps should be governed by
`opine.getConfig('debug')` rather than 
`opine.getConfig('styles.minify')` to avoid users having to change a whole
bunch of config to set up a production vs debug build. 

Extra config that is really required for basic functionality of the module
(for example, include paths, which are needed but different for every project)
should be accessed by `opine.getConfig('module.identifier', 'sane default')`.

*Reading from configs should be done outside of task scope.* If all of the calls
to `opine.getSource` et al are performed before any tasks are executed,
then fully populated default configuration files can be automatically generated,
saving having to hunt around for missing configuration values.

The whole point of this module is to reduce the amount of boilerplate/setup 
time, so it's okay to be a little didactic. If a user has a task that really
does need that extra config, they can just write a gulp task themselves.

Tasks should add themselves to the opine build, develop and watch lists as
appropriate, via `opine.addBuild`, `opine.addDevelop` and 
`opine.addWatch` lists respectively. All of the build tasks will be added
as a dependency to `gulp build`, while all of the `develop` tasks will be 
executed (along with the `watch` tasks) as part of `gulp develop`.

