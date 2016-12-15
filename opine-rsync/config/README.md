opine-rsync
======

This module copies a directory tree to a remote server.

## Installation:

```
yarn add gulp gulp-opine opine-rsync
```

## Configuration:

- `opine.rsync.host`: the target hostname to copy to (can be an IP address or domain name).
- `opine.rsync.user`: the user to identify as.
- `opine.rsync.source`: the source directory to copy from. 
- `opine.rsync.dest`: the target directory to copy to.
- `opine.rsync.root`: omit this path from source when rsyncing.
- `opine.rsync.exclude`: an array of filenames to exclude (including wildcards)
