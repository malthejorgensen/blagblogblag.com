blagblogblag.com
================
My personal website and blog.

It uses the
[minimal theme](https://github.com/orderedlist/minimal) by @orderedlist.

And is powered by [Jekyll](https://github.com/mojombo/jekyll).

Problems (and solutions)
------------------------
I had problems with pages (not posts) not rendering as markdown: turns out you
need to use `{{ content }}` not `{{ page.content }}` to get rendered markdown.

See: <https://skratchdot.com/2012/05/markdown-not-working-in-jekyll/>

Acknowledgement
---------------
The code and style of this blog was inspired by:
Tom Preston-Werner's [blog](https://tom.preston-werner.com/) ([repo](https://github.com/mojombo/mojombo.github.io))
and Corey Donohoe's [blog](https://www.atmos.org/) ([repo](https://github.com/atmos/atmos.github.io))

