opine-styles
=====

This module compiles a directory of Sass stylesheets and then runs them through
autoprefixer and (outside of debug mode) cleanCSS.

## Installation:

```
yarn add gulp gulp-opine opine-styles
```

## Configuration:

Reminder: with opine you can run `gulp config-defaults` to print out the current
values of all configuration values that haven't been explicitly defined.

- `opine.styles.source`: a directory containing the sass source files 
- `opine.styles.dest`: the directory to save the output .css files
- `opine.styles.includes`: an array of paths for node-sass to use as include directories

