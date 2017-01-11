The curious case of Python imports
=============================
Let's say you import a package or module in Python

    import spam

In a folder with the following files and directories

    spam.py
    spam/
         __init_.py

(`__init__.py` is in the `spam`-directory)

Here, `import spam` could either refer to either the file `spam.py` or the directory `spam/` with the `__init__.py` file in it.

Which one will be imported?

**tl;dr** The directory `spam` will  be imported.

The basics
---------------
In Python individual `.py`-files are called _modules_ -- i.e. `spam.py` is a module.
And directories containing an `__init__.py`-file are called _packages_ -- i.e. `spam/` is a package.

So far, so good. Our question boils down to whether Python will import the module or the package first.

Unfortunately, this is not described in the Python documentation<sup>3</sup> – and to make matters even worse the [Python `import` documentation](https://docs.python.org/2.7/reference/simple_stmts.html#import) deliberately conflates the module and package terms, making things even more confusing.<sup>4</sup>

StackOverflow to the rescue
---------------------------------
So I did what any programmer would do – search Google, and find some StackOverflow questions:

* [Python: what does “import” prefer - modules or packages?] 
  The answer here is purely trial-and-error -- basically, "packages are imported first on the machines I tried". Normally I would leave it at that and say OK, good enough. But there's a reason why I wouldn't trust that sort of answer in this case. (See the next section "Directory entry order") 
* [Python import precedence: packages or modules?]
  The answers given here, either don't resolve the actual problem or is once again trial-and-error.
* [Python Import Class With Same Name as Directory]
  Here is an answer that _does_ reference the Python documentation, but it only covers the `import ham from spam` case, not the simpler `import spam` and actually the referenced documentation doesn't even apply.<sup>5</sup>

No luck.

[Python: what does “import” prefer - modules or packages?]: http://stackoverflow.com/questions/6049825/python-what-does-import-prefer-modules-or-packages?noredirect=1&lq=1#comment15934593_6050009
[Python import precedence: packages or modules?]: http://stackoverflow.com/questions/4092395/python-import-precedence-packages-or-modules?noredirect=1&lq=1
[Python Import Class With Same Name as Directory]: http://stackoverflow.com/a/16245345/118608

Directory entry order
-----------------------------
As the precedence is not documented anywhere – one could start to worry that there simply is no precedence. Is it undefined? This would be normal in C and C++ where [undefined behaviour] leaves these sort of details up to the implementer of the compiler, and the programmer cannot rely on specif. At this point we can start guessing how Python might have implemented the import functionality. 

At some point the Python interpreter has to search in the filesystem to find the imported module or package. It would simply iterate through the directories until it found a module or package with a matching name.

Iterating through the files and subdirectories of a directory will in general happen in [arbitrary order](http://stackoverflow.com/questions/8977441/does-readdir-guarantee-an-order). An so t

You can get the "unsorted" list of entries in a directory by running `ls -f`. This is equivalent to the output of `import os; os.listdir(...)` in Python.
On OS X it seems even though it should be "unordered" it's always alphabetically sorted.
On Ubuntu the entries were listed in the order they were created.
On FreeBSD the ordering was arbitrary – not by creation time, not by name, and not by type (directory/file).

Conclusion
----------------
Somebody<sup>6</sup> found a very old Python "essay" (don't know what that is) explaining that this is the intended behaviour, but linking to the now dead http://www.python.org/doc/essays/packages.html.
It now lives at: http://legacy.python.org/doc/essays/packages.html.


References
-------------
<sup>3</sup> not in the [Python 2.7.13 docs](https://docs.python.org/2.7/tutorial/modules.html) nor the [Python 3.6.0 docs](https://docs.python.org/3.6/tutorial/modules.html) nor [PEP 302](https://www.python.org/dev/peps/pep-0302/) describing imports
<sup>4</sup> From the `import`-documentation: _unless otherwise specified, the term “module” will refer to both packages and modules_
<sup>5</sup> In the answer the user _Bakuriu_ references the following part of the Python documentation:
> Note that when using `from package import item`, the item can be either
> a submodule (or subpackage) of the package, or some other name defined
> in the package, like a function, class or variable. The `import`
> statement first tests whether the item is defined in the package; if
> not, it assumes it is a module and attempts to load it. If it fails to
> find it, an `ImportError` exception is raised.

However, this just says that any variable, class, or function in a package takes precedence over a module of the same name. -- Not that the package itself would be loaded "before" a module of the same name.

<sup>6</sup> http://stackoverflow.com/questions/6049825/python-what-does-import-prefer-modules-or-packages?noredirect=1&lq=1#comment15934593_6050009

* http://stackoverflow.com/questions/4092395/python-import-precedence-packages-or-modules
* http://stackoverflow.com/questions/6049825/python-what-does-import-prefer-modules-or-packages
