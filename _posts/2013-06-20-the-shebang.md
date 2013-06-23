---
layout: post
title: The Unix shebang (#!)
---
[The Unix shebang](http://en.wikipedia.org/wiki/Shebang_(Unix)) is
the first line in a typical executable Unix script. For example a
an executable Python script called 'hello' can be run by writing
`./hello` on the command line, instead of writing out the full
command `python hello`, given that the first line in the script is

    #!/usr/bin/python

This line tells that the script should be run by using the Python
interpreter located at `/usr/bin/python`. E.g.

    > cat hello 
    #!/usr/bin/python
    print 'Hello World!'
    > ./hello
    Hello World!

One would think that the shell, e.g. `bash` or `zsh` interprets this
line and executes the proper script interpreter. But it's not the shell
– it's actually [the kernel that interprets this line](http://lists.gnu.org/archive/html/bug-bash/2008-05/msg00052.html).  
(For further reference check out <http://www.in-ulm.de/~mascheck/various/shebang/>)

I found this out when trying to use Python `virtualenv` which creates
`.venv/bin/pip`. The `pip` file is a Python script with a shebang in the
beginning -- in this case something along the lines of

    #!"/Users/Malthe/python project/.venv/bin/python"

Here `virtualenv` has quoted the path because it has a space in it. But
this doesn't work on OS X 10.7 (I haven't tested on other systems).

I haven't found a solution yet (working on it).
The XNU (Mac OS X) kernel code parsing the shebang can be found [here](http://www.opensource.apple.com/source/xnu/xnu-1504.7.4/bsd/kern/kern_exec.c)
beginning at line 432.

So I wrote a file `test` to check out the behaviour:

    #!/bin/exec-space arg1 arg2 arg3 arg4 arg5 arg6 arg7 arg8 arg9 arg10 arg11 arg12

With `exec-space` being:

    #!/bin/sh
    echo $0
    echo $1
    echo $2
    echo $3
    echo $4

Running `./test` in [fish](http://fishshell.com/) gives the following error

    > ./test
    Failed to execute process './test'. Reason:
    exec: Exec format error
    The file './test' is marked as an executable but could not be run by the operating system.
    
`bash` does nothing

    > ./test
    >

`zsh` does something

    > ./test
    /bin/exec-space
    arg1 arg2 arg3 arg4 arg5 arg6 arg7 arg8 arg9 a
    ./test
    
The result from `zsh` show that all arguments are concatenated intro `$1`
but truncated after some number of characters. The morale of the story is
then to not use `virtualenv` in neither paths containing spaces nor 
long paths. I guess computer software still lives in 1300 BC...

A guy called Steve Smith found out the same thing a couple of years ago:
<http://stevesmithbytes.blogspot.com/2011/02/handling-spaces-in-shebang-line-in-mac.html>
