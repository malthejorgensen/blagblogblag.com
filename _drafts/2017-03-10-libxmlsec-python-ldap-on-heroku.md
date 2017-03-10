Problems:

* http://stackoverflow.com/questions/10509607/python-ldap-failed-to-install-in-heroku

Solutions:

* http://starboard.flowtheory.net/2015/07/adventures-with-heroku-python-saml-libxmlsec1-and-swig/

The `heroku-buildpack-apt` buildpack
------------------------------------
If you're reading this @ddollar, thank you! If not, thank you anyway, I guess :)

The `heroku-buildpack-apt` (authored by @ddollar) allows you to install `apt`-packages
on your Heroku dynos.

This is pretty great, as many PyPI-packages depend on external non-Python libraries
being installed.

Two Python packages that have such external dependencies are:

* `python-ldap` depends on the apt packacges `python-dev`, `libssl-dev`, `libsasl2-dev`, and `libldap2-dev`
* `dm.xmlsec.binding` depends on the apt package `xmlsec1-dev`

So can have these in our Heroku app's `requirements.txt` as long as we
run the `heroku-buildpack-apt` first with the `Aptfile`

    xmlsec1-dev
    python-dev
    libssl-dev
    libsasl2-dev
    libldap2-dev
    
The buildpack is also nice enough put the environment variables 
`PATH`, `LD_LIBRARY_PATH`, `LIBRARY_PATH`, `INCLUDE_PATH`, `CPATH`, `CPPPATH` `PKG_CONFIG_PATH`
in the buildpack's `export`-file, which makes those environment variables
availabe to the next package, and also puts the installed source/header-files
and libraries of those installed packages on in the relevant enviroment variables<sup>3</sup>:

    export LD_LIBRARY_PATH="$BUILD_DIR/.apt/usr/lib/x86_64-linux-gnu:$BUILD_DIR/.apt/usr/lib/i386-linux-gnu:$BUILD_DIR/.apt/usr/lib:$LD_LIBRARY_PATH"
    export LIBRARY_PATH="$BUILD_DIR/.apt/usr/lib/x86_64-linux-gnu:$BUILD_DIR/.apt/usr/lib/i386-linux-gnu:$BUILD_DIR/.apt/usr/lib:$LIBRARY_PATH"
    export INCLUDE_PATH="$BUILD_DIR/.apt/usr/include:$BUILD_DIR/.apt/usr/include/x86_64-linux-gnu:$INCLUDE_PATH"
    export CPATH="$INCLUDE_PATH"

<sup>3</sup> https://github.com/heroku/heroku-buildpack-apt/blob/5755b0ea0c5468388d3261eeb19ceb39a6fb4f71/bin/compile#L75-L84

Heroku's `.profile.d`
---------------------
Heroku allows overriding the environment via files put in the `.profile.d`-directory<sup>5</sup>
of your repository.
But those are only sourced before your app runs -- not before or during the buildpack
execution.

<sup>5</sup> https://devcenter.heroku.com/articles/buildpack-api#profile-d-scripts

pip - per requirement overrides
-------------------------------

http://stackoverflow.com/a/22942120/118608
You pass 
Works -- but can't be used because during the build, the files of the app
and the files install by `heroku-buildpack-apt` resides in a temporary
directory, e.g. `/tmp/build_b125afb633fa985fd5b0f7f9586d20f9`.

/.apt/usr/include

Only after all buildpacks have run, and the build finishes, will the app and
the files left by the buildpacks be moved to `/app`.

This means we have to use `/tmp/build_b125afb633fa985fd5b0f7f9586d20f9/.apt/usr/include/sasl`
as the include path.

###
Lucky us! The path of the temporary directory (`/tmp/build_b125afb633fa985fd5b0f7f9586d20f9`)
is available as the environment variable `$BUILD_DIR` so we could potentially do

    # requirements.txt
    dm.xmlsec.binding --global-option=build_ext --global-option="-I$BUILD_DIR/app/.apt/usr/include/xmlsec1"

You can even include multiple directories like this

# requirements.txt
    dm.xmlsec.binding --global-option=build_ext --global-option="-I/app/.apt/usr/include:/app/.apt/usr/include/xmlsec1"

Note: The pull request proposes the syntax `${BUILD_DIR}` -- _not_ `$BUILD_DIR` in order
      to indicate that it's not Unix syntax, but rather a cross-platform syntax that
      translates to `%BUILD_DIR%` on Windows and `$BUILD_DIR` on Unix-like systems.

https://github.com/pypa/pip/pull/3728
https://pip.pypa.io/en/stable/reference/pip_install/#per-requirement-overrides


Ok, so `requirements.txt` can't save us -- at least for the moment

### Heroku's `bin/pre_compile`
Before doing `pip install` the Python buildpack will run the file
`bin/pre_compile` in your repository, if it exists.

Initially it looks like this is actually run in the environment of
build process as `source bin/pre_compile`. However, looking closer
we find the it's run in a subshell and can't change the environment
of the parent build shell.

https://github.com/heroku/heroku-buildpack-python/issues/324

Choosing the right library to link to
-------------------------------------
The next problem was that libldap wasn't linking to the right library.
It was linking to the static library (`.a`) instead of the dynamic
library (`.so`)

    /usr/bin/ld: /app/.apt/usr/lib/x86_64-linux-gnu/libldap_r.a(cyrus.o): relocation R_X86_64_PC32 against symbol `ldap$ pvt_sasl_mutex_dispose' can not be used when making a shared object; recompile with -fPIC
    libldap_r.a(cyrus.o): relocation R_X86_64_PC32 against symbol `ldap$ pvt_sasl_mutex_dispose' can not be used when making a shared object; recompile with -fPIC
    libldap_r.a(cyrus.o):  symbol `ldap$ pvt_sasl_mutex_dispose' can not be used when making a shared object; recompile with -fPIC

http://stackoverflow.com/a/13367106/118608
http://www.openldap.org/lists/openldap-software/200212/msg00404.html


Notes
-----
@skilljar's Python buildpack solves this for `xmlsec` (https://github.com/skilljar/heroku-buildpack-python)
https://github.com/heroku/heroku-buildpack-python/compare/master...skilljar:master

@damgad has a Python buildpack that sovles this for `python-ldap` (https://github.com/damgad/heroku-buildpack-python-ldap)

http://stackoverflow.com/a/26776690/118608


Hubba hubba http://lucumr.pocoo.org/2012/6/22/hate-hate-hate-everywhere/
