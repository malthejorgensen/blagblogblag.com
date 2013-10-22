blagblogblag.com
================
My personal website and blog.

It uses the
[minimal theme](http://github.com/orderedlist/minimal) by @orderedlist.

And is powered by [Jekyll](http://github.com/mojombo/jekyll).

Problems (and solutions)
------------------------
I had problems with pages (not posts) not rendering as markdown: turns out you
need to use `{{ content }}` not `{{ page.content }}` to get rendered markdown.

See: <http://skratchdot.com/2012/05/markdown-not-working-in-jekyll/>

Acknowledgement
---------------
The code and style of this blog was inspired by:
Tom Preston-Werner's [blog](http://tom.preston-werner.com/) ([repo](http://github.com/mojombo/mojombo.github.io))
and Corey Donohoe's [blog](http://www.atmos.org/) ([repo](http://github.com/atmos/atmos.github.io))

