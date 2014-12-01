---
layout: post
title: UNIX tools and \0 (find -print0, xargs -0)
---

A normal way to delete all files containing `_old` in the current folder (on a UNIX system)
is a command like the following:

    find . -iname '*_old*' | xargs rm

However this doesn't work for filenames containing spaces as `rm` expects spaces to separate each file.

The solution to this is to add `-print0` to the `find` command and `-0` to `xargs`:

    find . -iname '*_old*' -print0 | xargs -0 rm

Now my problem is that I only want to delete the first 5 files.
The "UNIX way" is to do something like:

    find . -iname '*_old*' | head -n 5 | xargs rm

... which doesn't work with spaces. Our `-print0` won't work
because doesn't have the equivalent of the `xargs -0` flag.

## `awk` to the rescue?
_Note_: The following assumes that `awk` refers to BSD-awk -- specifically the `awk` provided
on OS X 10.7.5.

`awk` operates on a line-by-line basis by default, but this can be changed with the record separator variable `RS`.
A simple `head -n 5` implementation would be `awk 'NR <= 5 {print}'` in awk.

Lets say we're in a folder with these files:

    > ls -1
    Los Angeles vacation_001_old.jpg
    Los Angeles vacation_002_old.jpg
    Los Angeles vacation_003_old.jpg
    Los Angeles vacation_004_old.jpg
    Los Angeles vacation_005_old.jpg
    Los Angeles vacation_006_old.jpg
    Los Angeles vacation_007_old.jpg
    Los Angeles vacation_008_old.jpg
    Los Angeles vacation_009_old.jpg

With `awk` we should be able to do something like this:

    > find . -iname '*file*' -print0 | awk 'BEGIN {RS="\0"}; NR <= 5 {print}'
    ./Los Angeles vacation_001_old.jpg

... but it doesn't work: `awk` never finds records beyond the first one because of the NUL character `\0`.
The NUL character is the C-string terminator and thus AWK stops reading input after seeing it because it thinks
the input string has ended.

However the more modern `awk`s _gawk_ and _mawk_ doesn't suffer from the same shortcoming:

    > find . -iname '*_old*' -print0 | mawk 'BEGIN {RS="\0"}; NR<=5 {print}'
    ./Los Angeles vacation_001_old.jpg
    ./Los Angeles vacation_002_old.jpg
    ./Los Angeles vacation_003_old.jpg
    ./Los Angeles vacation_004_old.jpg
    ./Los Angeles vacation_005_old.jpg

But the `print` function in `awk` (+ `mawk` and `gawk`) print newlines by default. We can change this by
setting the output field separator `ORS`

    > find . -iname '*_old*' -print0 | mawk 'BEGIN {RS=ORS="\0"}; NR<=5 {print}'
    ./Los Angeles vacation_001_old.jpg./Los Angeles vacation_002_old.jpg./Los Angeles vacation_003_old.jpg./Los Angeles vacation_004_old.jpg./Los Angeles vacation_005_old.jpg

The NUL characters doesn't print -- but they **are** there -- you can check by piping into `cat -v`.

Finally we reach the command:

    > find . -iname '*_old*' -print0 | mawk 'BEGIN {RS=ORS="\0"}; NR<=5 {print}' | xargs -0 rm

In `sed` you can do something like `sed -n '1,5p'` but sed expects newlines and has no setting to change
the "separator" to be something other than newline
(sed _is_ Turing-complete, however, so nothing is impossible<sup>[1][sed-turing-complete]</sup>).

## Afterthought
I see this as another example of the fact the UNIX tools are becoming outdated
and that we need to ditch the "string-first programming" and think and program
in datastructures (like PowerShell on Windows does).
We need to built tools that can handle filenames containing spaces and unicode.
(For another example see this older blog post about [The Unix shebang (#!)](#The Unix shebang (#!)))

For now I've made a `head` "implementation" for input separated by NULs instead
of newlines:

    head0() {
      mawk 'BEGIN {RS="\0"}; {print}' | head $@ | mawk 'BEGIN {ORS="\0"}; {print}'
    }

[sed-turing-complete]: http://www.catonmat.net/blog/proof-that-sed-is-turing-complete/
