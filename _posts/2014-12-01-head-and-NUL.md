---
layout: post
title: UNIX tools, spaces in filenames and \0
---

A normal way to delete all files containing `_old` in the current folder (on a UNIX system)
is a command like the following:

    find . -iname '*_old*' | xargs rm

However this doesn't work for filenames containing spaces as `rm` expects spaces to separate each file.

The usual solution to this is to add `-print0` to the `find` command and `-0` to `xargs`:

    find . -iname '*_old*' -print0 | xargs -0 rm

Now my problem is that I only want to delete the first 5 files.
The "UNIX way" is to do something like:

    find . -iname '*_old*' | head -n 5 | xargs rm

– and now we're back to something that doesn't work with filenames containing spaces.
Our `-print0`-trick from earlier won't work because `head` doesn't have an equivalent
of the `xargs -0` flag.

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

    > find . -iname '*_old*' -print0 | awk 'BEGIN {RS="\0"}; NR <= 5 {print}'
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
I think the UNIX tools are great. No doubt about it. I use them every day, and the
"do one thing, and do it well"-philosophy plus the composability of tools through pipes
are some of the things that these tools invaluable to many programmers, including me.
BUT the tools _are_ from the 80's (and sometimes even older) and have fallen out of touch
with modern computing. Today the users' needs and behaviour shapes the systems rather
than the other way around.

We need to build tools that can handle filenames containing spaces and unicode characters.
I have an older blog post that touches the same topic: [The Unix shebang (#!)](#The Unix shebang (#!)).

For now I've made a `head` "implementation" for input separated by NULs instead
of newlines:

    head0() {
      mawk 'BEGIN {RS="\0"}; {print}' | head $@ | mawk 'BEGIN {ORS="\0"}; {print}'
    }

Should we replace the UNIX tools with more modern, but equivalent tools? Is a command-line
like PowerShell with built-in types the way to go?

One thing is clear to me: a solution to these problems need to be found. And
preferably one that fixes them once and for all.

<!-- We cannot live in a world of "string-first programming" we need to think and program
in structures (like PowerShell on Windows does). -->

[sed-turing-complete]: https://www.catonmat.net/blog/proof-that-sed-is-turing-complete/
