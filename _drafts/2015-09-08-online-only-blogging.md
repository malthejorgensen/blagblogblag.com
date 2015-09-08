---
layout: post
title: Online-only blogging
---
I blog way too little. I have seven 90%-ready-to-publish posts sitting in my `_drafts` folder.

In order to publish more – write more posts – I want to lower the barrier from thought to
published post. My initial thought was Wordpress. But Wordpress is a huge beast,
and while the WYSIWYG-interface itself is kind of what I'm looking for,
there's also tons of cruft and superflous features I don't need and actually slows down
the process and highens the barrier to create a new post.

So if I'm sticking to my Github Pages and Jekyll-powered blog for now – what are my options?

**Options**
- [Prose]
- [Tinypress]
- [GitBook]

Prose
-----
**Problems**

- Doesn't always save changes
- Deletes files occassionally and randomly >:(

Tinypress
---------
Tinypress has the nicest interface of the services reviewed here, and they really seem to know
their audience with a cruft-free and very slick interface.

**Problems**

- Can't choose what repository to edit: locked to `<username>.github.io`
- Can only choose from a limited number of themes
- Can't live-preview: You have to click _Preview_ every time you want to see the result of your Markdown.

GitBook
--------
GitBook is for writing books, saving them to Github, and eventually selling them via the GitBook platform.
It allows for Markdown editing of arbitrary Github repositories, and can thus be used as a blog engine as well.

It definitely has the most advanced interface with live-preview of your Markdown, branch-selector,
revision history and a wealth of other features. The cost of the advanced interface is a slower
setup time – it did take me considerably longer about five minutes to set up with my repository,
compared to 15-20 seconds for the two other services.

Even though the interface is so advanced – and maybe because of it – it does have some major
flaws in relation to editing Jekyll-powered blogs at least.

**Problems**

- Doesn't show `_drafts` folder in the file tree at all
- Doesn't show all files in `_posts` folder (2 out of 11)



[Prose]: https://prose.io
[Tinypress]: https://tinypress.co/
[GitBook]: https://www.gitbook.com/
