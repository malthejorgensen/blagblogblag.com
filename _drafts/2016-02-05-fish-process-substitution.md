---
layout: post
title: fish process substitution
---


Currenty, I'm using fish as my shell. Having used zsh for quite a while, there
are some features I was missed from ZSH.

One is the ability to copy-and-paste any and all examples from the internet
(watch, out that may be dangerous<sup>2</sup>). In Fish you can't do that, as
fish's syntax isn't always compatible with those.

For example fish doesn't support the `&&` and `||` operators, so instead of

    ./long_running_install_script && echo "Success!"

you have to do

    ./long_running_install_script; and echo "Success!"

This actually makes fish more aligned with the original Unix philosopy 
"do one thing, and do it well", as the system already provides a way to
do the thing you need, the shell shouldn't become an all-encompassing
system of itself.

Another thing is the syntax for _command substitution_. Here we use the 
`which` command to look up the path for the `python` binary, and then
use `ls -l` to see what it links to (if its a symbolic link):

    ls -l `which python`   # old syntax (still works)
    ls -l $(which python)  # modern syntax

    # in both cases, what gets "executed" by the shell
    ls -l '/usr/local/bin/python'
    # i.e. `which python` is replaced by it's output /usr/local/bin/python

in fish that looks like

    ls -l (which python)

The fish syntax is simpler, and supports nesting like the modern syntax in
bash and zsh, but in this particular case, there doesn't seems to be much
reason to break "backwards compatibility". But then again, having already
broken compatibility elsewhere – why not change to a lighter syntax here?

Process substitution
--------------------
That leads me to the real subject of today's post. One really cool thing about
ZSH is Process Substitution<sup>4</sup>. Process substitution lets you take
the output of a command and use it in place of a file, instead of outputting
it directly into the command you're trying to execute which is what command
substitution does.

Let's say you have two files with a bunch of names, and you want to see what
names appear in one list, but not in the other. `diff` seems like the perfect
tool, but that's only going to work if the two list are sorted first. With
process substitution we can do that on-the-fly:

    diff =(sort soccer_team.txt) =(sort party_invites.txt)
    # what gets "executed" by the shell
    diff /tmp/tempfileA /tmp/tempfileB

Here zsh writes the output of the sort commands to two temporary files, which
are then passed to `diff`. zsh keeps track of the temporary files and deletes
them when they have been used.

In my case I needed to install all packages from `requirements.txt` except one – `numpy`.
The obvious thing to do here is `cat requirements.txt | grep -v numpy`, which prints
all lines except ones containing `numpy`. However, `pip` doesn't support any piping
from STDIN.

In ZSH I would do a process substitution

    pip install -r =(cat requirements.txt | grep -v numpy)

today I found out you can do something similar in fish, using the command
`psub`<sup>6</sup>:

    pip install -r (cat requirements.txt | grep -v numpy | psub)

Once again, fish adheres to the UNIX philosophy, and chooses _not_ to bloat with
extra syntax, what can be done with a command :)

(To be clear: `psub` is fish specific, and actually part of the syntax, due to
the way it has to cleanup after file-closing it would probably not be able to be
implemented as a separate command outside of fish)

**References**


<sup>4</sup> ZSH process substitution: <https://zsh.sourceforge.net/Intro/intro_7.html>
<sup>5</sup> fish process substitution: <https://news.ycombinator.com/item?id=9017996>
Fish reverse process substitution: <https://github.com/fish-shell/fish-shell/issues/1786>