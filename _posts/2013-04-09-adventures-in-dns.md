---
layout: post
title: Adventures in DNS
---
When you start a site on a specific domain you often wanna have some email
account associated with that domain, such that users of your site can send mail
to an email that is transparently belonging to the site. E.g.
`support@example.org` rather than `support-mysite@gmail.com`.

An easy and in my opinion very nice solution is setting up a [Google
Apps](http://google.com/a) for the domain. This way you get the familiar
Gmail-interface for your `support@example.org` mail, and you don't have to set
up and manage some email server like Postfix or exim4. ([Which can be HUGE
hassle][codinghorror-email])

To get this email service you need to set up Google Apps MX records, which is
the real reason I'm writing this post: I'm getting tired of setting up these
records can be a hassle with a my current DNS service [GratisDNS](gratisdns.dk).

What you wanna do is have the following MX records in the DNS of your site:

    @ 3600 IN MX 1 aspmx.l.google.com.
    @ 3600 IN MX 5 alt1.aspmx.l.google.com.
    @ 3600 IN MX 5 alt2.aspmx.l.google.com.
    @ 3600 IN MX 10 aspmx2.googlemail.com.
    @ 3600 IN MX 10 aspmx3.googlemail.com.

where `@` is placeholder for your domain name.

Most DNS services have  But I'm getting tired of adding the records one by one
through the age-old interface of GratisDNS.dk.

GratisDNS.dk
QuickDNS.dk
pleen.dk

Route 53 on AWS (Amazon Web Services) definitely has the features I want but
the interface could be better, which is why I ended up choosing gandi.net which
has a very slick interface.

![Gandi.net Expert mode](img/gandi.net-expert-mode.png "Gandi.net Expert mode")
Edit mode "Expert" lets you edit the zone file yourself.
What you might wanna is to read up on:
http://en.wikipedia.org/wiki/Zone\_file
http://www.zytrax.com/books/dns/ch8/soa.html
which I found to be nice resources.

There are some gotchas to be aware of:
You cannot refer to a specific domain name in the zone file
  -- use `@` to refer to the domain
You (cannot specify the SOA directive)[1] -- this is set by Gandi.net.
You cannot use parenthesis (for multiline statements)

[1]: http://groups.gandi.net/en/topic/gandi.en.domain.dns/22779 "Question on Gandi.net"
[codinghorror-email]: http://www.codinghorror.com/blog/2010/04/so-youd-like-to-send-some-email-through-code.html "Coding Horror: So You'd Like to Send Some Email (Through Code)"
