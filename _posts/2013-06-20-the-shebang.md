---
layout: post
title: The Unix shebang (#!)
---
[The Unix shebang](http://en.wikipedia.org/wiki/Shebang_(Unix)) is
the first line in a typical executable Unix script, for example a
an executable Python script called 'hello' can be run by writing
`./hello` on the command line. The first line in the script

    #!/usr/bin/python
    
tells that the script should be run by using the Python interpreter
located at `/usr/bin/python`. E.g.

    > cat hello 
    #!/usr/bin/python
    print 'Hello World!'
    > ./hello
    Hello World!


One would think that the shell, e.g. `bash` or `zsh` interprets this
line and executes the proper script interpreter. But it's not
– it's actually [the kernel that interprets this line](http://lists.gnu.org/archive/html/bug-bash/2008-05/msg00052.html).  
Also check out <http://www.in-ulm.de/~mascheck/various/shebang/>.

I found this out when trying to use Python `virtualenv` which creates
`.venv/bin/pip` which is a Python script file with a shebang in the
beginning e.g. `#!"/Users/Malthe/python project/.venv/bin/python"`.

`virtualenv` has quoted the path because it has a space in it. But
it doesn't work on OS X 10.7 – I haven't tested on other systems.


A guy called Steve Smith found out the same thing a couple of years ago:
<http://stevesmithbytes.blogspot.com/2011/02/handling-spaces-in-shebang-line-in-mac.html>
