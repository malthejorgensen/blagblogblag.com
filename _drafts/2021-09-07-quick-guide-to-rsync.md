---
layout: post
title: Quick guide to using rsync for backups
---
This is a guide to rsync when restoring a backup from e.g. [Backblaze].

What you want is usually `rsync -a src/ dest/`.  
E.g. if you're restoring your SSH keys from a backup it'd be `rsync -a ssh-dir-backup/ ~/.ssh/`.

**WARNING:** Here, `rsync` will overwrite files at the destination even if files
there are newer than those at the source.

- The `/` at the end is important. If omitted, you'd be rsyncing into `~/.ssh/ssh-dir-backup`
  instead of directly into `~/.ssh`.
- Here I'm using the `-a`-flag which preserves as much stuff as possible and
  uses timestamps to decide whether a file should be transferred or not.

If you don't want more recently updated files to be overwritten at the destination
pass the `-u`-flag on top of the `-a`-flag.

In some cases you don't want to use timestamps, in that case, I'd recommend
`rsync -rcp dir1/ dir2/`, which uses checksums.

### What files changed? (debugging)
**tl;dr** You can debug using `rsync --dry-run -c -r -v`
<!-- or `rsync --dry-run -c -r -v --itemize-changes` -->

Before a sync I often do `--dry-run -v` to see what files are going to be
transferred.

If you're wondering why a file is being transferred add the `--itemize-changes` flag.

- `>f+++++++` means new file
- `>f..T....` or `>f..t....` means different modified at times (avoid this by using the `-c/--checksum` flag)
- `>f.sT....` means both size and time changed (this can happen when not using the `-c`-flag)
- `>fcsT....` means checksum, size and time changed

If no file exists at the destination, `rsync` will transfer the file as-is
preserving permissions, but not created at/modified at
timestamps. To preserve the timestamps pass the `-t`-flag.
The interesting part then happens when a matching file _does_ exist at the
destination. By default -- when passing no flags -- `rsync` will overwrite
the destination file while preserving permissions of the destination file.
However, both the created at and modified at timestamps will be updated.

### What about executabilty?
Don't worry, the `--executability`-flag is implied in the `-p`-flag which in turn is implied in the `-a`-flag.
The issue is that Backblaze doesn't set the file permissions in the `.zip`-file
restore that you get. (They can't since it's a DOS-style .zip)

### Ending notes about `--list-only` and `-q`
You'll almost never want `--list-only`. Also, `-q` doesn't work in tandem with
`--dry-run` or anything that outputs anything, so it's not useful for these
purposes. I haven't found a way to hide the stats.



[Backblaze]: https://backblaze.com