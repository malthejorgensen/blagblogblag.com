---
layout: post
title: Fastest way to get your NTFS-drive writeable on OS X
---
Create the file `/etc/fstab` (it doesn't exists by default) and add the line

    LABEL=DRIVENAME none ntfs rw,auto,nobrowse

where `DRIVENAME` is the name of your NTFS drive. Unmount and mount the drive by issuing the following commands:

    diskutil eject DRIVENAME
    diskutil mount DRIVENAME

_Note_: Do not use the command `umount` or `diskutil unmount` instead of `eject`
-- it forces the unmount and stops any file transfers currently running to and
from the disk (which means you are likely to lose data).

You can now browse the drive by issuing the command `open /Volumes/DRIVENAME`.

Unfortunately the `nobrowse` flag in `fstab` means that the drive _will not_ appear on the Desktop
nor in the Finder sidebar. Sadly, if you omit it -- the drive will appear, but will
be read-only.

Tested on OS X 10.7.5.

Reference: https://computers.tutsplus.com/tutorials/quick-tip-how-to-write-to-ntfs-drives-in-os-x-mavericks--cms-21434
