---
layout: post
title: Quick guide to using rsync for backups
---
This is a guide to rsync when restoring a backup from e.g. [Backblaze].

If no file exists at the destination, `rsync` will transfer the file as-is
preserving permissions (and content of course), but not created at/modified at
timestamps. To preserve the timestamps pass the `-t`-flag.
The interesting part then happens when a matching file _does_ exist at the
destination. By default -- when passing no flags -- `rsync` will overwrite
the destination file while preserving permissions of the destination file.
However, both the created at and modified at timestamps will be updated.

- Always put an `/` at the end of the path to a directory
  When syncing two folders, you'll want to make sure there's a `/` at the end of
  the path. Otherwise things won't work as expected
  Principally this is only important for the first of the two directories, but
  it's easier to remember to just do it on both.
- Most often you'll want `rsync -a dir1/ dir2/`
  `-a` is for "archive" and syncs files so that, 
- Debug using `rsync --dry-run -c -r -v`
           or `rsync --dry-run -c -r -v --itemize-changes`
- Before a sync I often do `--dry-run -v` to see what files are going to be
  transferred. If you're wondering why a file is being transferred add the 
  `--itemize-changes` flag.
  `>f+++++++` means new file
  `>f..T....` means different modified at times (avoid this by using the `-c/--checksum` flag)
  `>f.sT....` means both size and time changed
-

You'll almost never want `--list-only`. Also, `-q` doesn't work in tandem with
`--dry-run` or anything that outputs anything, so it's not useful for these
purposes. I haven't found a way to hide the stats.

### What about executabilty?
Don't worry, `--executability` is implied in `-p` which in turn is implied in `-a`.
The issue is that Backblaze doesn't set the file permissions in the `.zip`-file
restore that you get.



[Backblaze]: https://backblaze.com