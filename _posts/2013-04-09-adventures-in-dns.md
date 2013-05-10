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
records. It's a tedious and too click-hungry process on my current DNS
service [GratisDNS](http://gratisdns.dk).

To recieve mail sent to your domain through Google Apps what you gotta do is
have the following MX records setup in the DNS for your domain:

    example.org 3600 IN MX 1 aspmx.l.google.com.
    example.org 3600 IN MX 5 alt1.aspmx.l.google.com.
    example.org 3600 IN MX 5 alt2.aspmx.l.google.com.
    example.org 3600 IN MX 10 aspmx2.googlemail.com.
    example.org 3600 IN MX 10 aspmx3.googlemail.com.

At GratisDNS you submit a form (no-AJAX) for each MX entry and if you also want
to have aliases (.com, .net, .org, .dk) you get to Copy/Paste or type these
records in quite a few times. So I wanted to find some alternative DNS service
where setting up DNS records would be faster.

So I looked for some danish alternatives and found:

 * [QuickDNS.dk](http://quickdns.dk)
 * [pleen.dk](http://pleen.dk)

The interface on these sites was weird and I didn't really understand what was
going on so I continued my search internationally.

*Note*: [Dandomain.dk](http://dandomain.dk) actually has a pretty good
interface, and makes it a bit faster to set up the DNS records but still not
really as easy as I wanted to be.

Route 53 on AWS (Amazon Web Services) definitely has the features I want but the
interface could be better, which is why I ended up choosing
[gandi.net](http://gandi.net) which has a very slick interface.

## Enter the _Zone File_
All along what I was looking for was the **zone file**. The zone file is the
file the DNS server reads in order to know what to do when a DNS request for
your domain is received.
It is simply a text file wherein you specify your DNS records. It has a
somewhat funny syntax, and different DNS services allow different parts of the
syntax in their zone files.

This is the zone file I needed:

    @ 3600 IN MX 1 aspmx.l.google.com.
    @ 3600 IN MX 5 alt1.aspmx.l.google.com.
    @ 3600 IN MX 5 alt2.aspmx.l.google.com.
    @ 3600 IN MX 10 aspmx2.googlemail.com.
    @ 3600 IN MX 10 aspmx3.googlemail.com.

`@` is zone file syntax for "current domain" and in a DNS service this will most
likely already be specified when the zone file is loaded. (This is true for
    gandi.net)

What you might wanna is to read up on:

* <http://en.wikipedia.org/wiki/Zone_file>
* <http://www.zytrax.com/books/dns/ch8/soa.html>

, which I found to be nice resources.

## Gandi.net "Expert mode"
![Gandi.net Expert mode](img/gandi.net-expert-mode.png "Gandi.net Expert mode")
On gandi.net, you can set _Edit mode_ to _"Expert"_ which lets you edit the zone
file directly. This is actually the same as what you can do on QuickDNS.dk and
pleen.dk, though I didn't know about zone files at that time. Furthermore on
Gandi.net you can make a zone file template that you can use on multiple sites.
This is ideal for the MX record setup for Google Apps because it is the same for
all sites.

In a template you _have_ to use `@` as a placeholder for the domain name
(otherwise it would be a template that could be used for other domains) and thus
the zone file template for Google Apps MX records is exactly the one listed
earlier.
QuickDNS.dk actually allows exactly this kind of templating but the interface is
very confusing. Pleen.dk allows for editing the zone file directly but not
templating.

Gotchas for Gandi.net zone file templates:

* You cannot refer to a specific domain name in the zone file
  -- use `@` to refer to the domain
* You [cannot specify the SOA directive][1] -- this is set by Gandi.net.
* You cannot use parenthesis (for multiline statements)

[1]: http://groups.gandi.net/en/topic/gandi.en.domain.dns/22779 "Question on Gandi.net"
[codinghorror-email]: http://www.codinghorror.com/blog/2010/04/so-youd-like-to-send-some-email-through-code.html "Coding Horror: So You'd Like to Send Some Email (Through Code)"
