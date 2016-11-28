opine-silverstripe-build
========

This module will execute after rsync as part of the deploy build phase.

Its function is to ssh in to the target server and run 
`php framework/cli-script.php /dev/build` once files have finished transferring.

Usage:

```
yarn add gulp gulp-opine opine-silverstripe-build
```

It reads its configuration values from the [`opine-rsync`](https://github.com/studiothick/opine-rsync) block.

Briefly, these are:

- `opine.rsync.user`: the user to ssh as.
- `opine.rsync.host`: the hostname to ssh into.
- `opine.rsync.cwd`: the directory to execute the command in
