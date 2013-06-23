---
layout: post
title: Documentation is king!
---
Sam Saffron recently argued why [Ember is better than AngularJS for long term development](http://eviltrout.com/2013/06/15/ember-vs-angular.html)
– I don't have enough experience with either of these frameworks to say whether
that is true or false. A lot of commenters argue that Sam didn't quite
understand how to use AngularJS – but Sam just followed tutorials and examples.
So if he's using AngularJS wrong there's a problem with the examples, which Sam
also says:

> In fact, _what is idiomatic AngularJS_? None of the examples or blogs I read
> through demonstrated how to reuse object instances, for example. Is that just
> not done in AngularJS applications?

The commenters argue that AngularJS _does_ offer solutions to these problems – but that doesn't really matter
if a newcomer can't find these solutions. Last time I checked Ember itself didn't have much useful documentation
but it has become better since then.

Let me tell you a story before I get to my point.

The Rise of PHP
---------------
In the early 2000's the adoption of PHP accelerated rapidly. The architecture of
PHP was argueably pretty bad, coming from being a CGI/Perl framework without
much structure, it was converted into being largely a wrapper library over the C
standard library ([strpbrk], [strcspn]) and Posix functions ([opendir], [stat])
with templating functionality in order embed code in HTML.

[strpbrk]: http://www.php.net/manual/en/function.strstr.php
[strcspn]: http://www.php.net/manual/en/function.strcspn.php
[opendir]: http://www.php.net/manual/en/function.opendir.php
[stat]: http://www.php.net/manual/en/function.stat.php

People flocked to PHP in spite of this plus many inconsistencies in the framework and a lack of
features for structured programming (classes, modules, namespaces).  
There was a number of reasons for this – PHP was gratis, many hosts supported it, and it was easy to set up. But I think that there was another very significant reason gained so much traction: _PHP had very good
documentation_.  Every function in the PHP library has always had (at least since
the early 2000's) clear and comprehensive documentation on [PHP.net](http://php.net) with an example on almost every page.

The Open Source movement
------------------------
Today the we have a large number of open source projects, and it is well known how important documentation is. The first presentation of a new Open Source project is often a code example.

And yet the core of the discussion surrounding Sam's _Ember vs Angular_ is exactly a lack of documentation. The commenters
argue that Sam should be using some specific features of AngularJS that fixes
the problems Sam sees with the framework. But as long as these features are not
properly visible or used within the documentation they are practically non-existent and should be considered non-existent to any newcomer or average user.

The use of a language or library _is defined_ by the documentation; newcomers are going to copy and build off examples and tutorials in the documentation.

Which leads me to the point: **Documentation is king**.

