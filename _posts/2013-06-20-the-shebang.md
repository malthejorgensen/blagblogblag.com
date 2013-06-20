---
layout: post
title: The Unix shebang (#!)
---
[The Unix shebang](http://en.wikipedia.org/wiki/Shebang_(Unix\)) is
the first line in a typical executable Unix script. For example a
an executable Python script called 'hello' can be run by writing
`./hello` on the command line, i.e. without writing out the full
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
`#!"/Users/Malthe/python project/.venv/bin/python"`.
Here `virtualenv` has quoted the path because it has a space in it. But
this doesn't work on OS X 10.7 (I haven't tested on other systems).

I haven't found a solution yet (working on it).

A guy called Steve Smith found out the same thing a couple of years ago:
<http://stevesmithbytes.blogspot.com/2011/02/handling-spaces-in-shebang-line-in-mac.html>
