---
layout: post
title: Remote debugging with rpdb2
---

Recently I ran into a Python error, that only occured when piping the
output of the script:

    > python myscript.py | wc -l
    encode() argument 1 must be string, not None

How do I debug this? As the output gets "eaten" by the pipe, I can't see the
output from regular-old `pdb` (and won't be able to interact with it
meaningfully).

**Update**: I later found out that the easiest way to debug this situation, is `python -u -m pdb myscript.py | cat -u`, leaving you with the normal `pdb` prompt while also having piped output. (the `-u` is for unbuffered output)

_rpdb2 to the rescue!_ `rpdb2` allows remote debugging -- meaning that you
can debug from a different process and thus a different terminal window.

`rpdb2` is part of `winpdb` package, so I did the usual `pip install winpdb`. 
This only got me version 1.3.6, however, which doesn't work<sup>1</sup> :(

So I had to use the original tarball:

    pip install http://winpdb.googlecode.com/files/winpdb-1.4.8.tar.gz

even though version 1.4.8 seems to be on PyPi?<sup>2</sup>

------
**rpdb2 caveats**
* You need to use at least version 1.4.8 of `winpdb`
* You need to use the `-d` (or `--debuggee`) flag when running the script
* You need to use the `g` or `go` command instead of the usual `c` or `continue` command from `pdb`
  (the `c`/`continue` command doesn't exist in `rpdb2`!)
* You need to use the `bp` command to set a breakpoint, and the `bl` command to list the set
  breakpoints. The `b` command stops ("breaks") the program immediately, during execution.  

The prompt also doesn't evaluate expressions by default, so you can't do `print local_var`,
instead you have to do `eval local_var` or `exec print local_var`.  
`eval` will try to evaluate the expression in the actual debugging prompt (where
you're writing your commands), whereas `exec` will execute the statement in
"debuggee" (the process being debugged) and printed output will also appear
in the "debuggee" terminal window.

Why the author didn't go with the conventions established with `pdb` is beyond me :|

-----

Before `rdb2` starts, it asks you for a password

    > rdb2 -d myscript.py
    A password should be set to secure debugger client-server communication.
    Please type a password:1234

Now I'm back to the same problem `pdb` had! -- this prompt won't be shown to me when I pipe the output.
Luckily, it's always the same prompt, so you can simply type the password after waiting a bit for
`rpdb2` to start:

    > rdb2 -d myscript.py | wc -l
    1234
    
The next thing you need to do is to attach to the process:

    > rdb2 -a myscript.py
    A password should be set to secure debugger client-server communication.
    Please type a password:1234
    Password has been set.
    RPDB2 - The Remote Python Debugger, version RPDB_2_4_8,
    Copyright (C) 2005-2009 Nir Aides.
    Type "help", "copyright", "license", "credits" for more information.
    
    > *** Attaching to debuggee...
    > *** Debug Channel is NOT encrypted.
    > *** Successfully attached to
    > *** '/Users/John/Programming/Python/myscript.py'.
    > *** Debuggee is waiting at break point for further commands.
    > 

Here you most likely wanna hit `g<ENTER>` unless you wanna set up some breakpoints
first. That can be done with the `b` command.

Finally I got to my actual error -- the error was however caught at the very
top-level of the program, so I had to dig out the traceback of the caught exception:

    > exec import traceback
    Textual output will be done at the debuggee.
    
    > exec exc_t, value, tb = sys.exc_info()
    Textual output will be done at the debuggee.
    
    > exec traceback.print_tb(tb)
    Textual output will be done at the debuggee.

As noted the actual printout has to be viewed in the original "debuggee" process.

References:

<sup>1</sup> http://stackoverflow.com/a/3528712/118608  
<sup>2</sup> https://pypi.python.org/pypi/winpdb/1.4.8  
