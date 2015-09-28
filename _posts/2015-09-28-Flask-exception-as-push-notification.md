---
layout: post
title: Flask exception as push notification
---
I'm currently working on a small project: a web service written in Flask.

The service is currently at an early stage, and still so small that I want
to be notified of every exception that happens in production.

I can easily get these as mails<sup>1</sup> – which I am – but during peak hours I want to
be able to respond immediatly to an error, and not have it drown in the rest
of whatever mail I'm getting in.

So I thought, why not receive a push notification?

I was sure I had heard of at least one app made with just that in mind –
receiving custom push notifications that can be created automatically
via an API. (I don't want to create my own iOS app just for that with
provisioning and all that cruft and timesuck)

Sure enough: [Pushover] and [Boxcar] fit the bill. I ended up going with
Pushover for now as Boxcar requires iOS 8 which I'm not on yet.

I'm already sending the exceptions as mail to my Gmail, with
a "plus-alias": `my-email+flask-exceptions@gmail.com`<sup>2</sup>
so the Pushover email API<sup>3</sup> was perfect for quickly
getting up and running.

I set up a filter in Gmail, forwarding those mails (filtered on the `To:` field)
to `API-KEY@api.pushover.net` – and now I'm receiving exceptions from
Flask as push notifications on my phone. Pretty neat!

<sup>1</sup> <http://flask.pocoo.org/docs/0.10/errorhandling/#error-mails>  
<sup>2</sup> <https://support.google.com/mail/answer/12096?hl=en>  
<sup>3</sup> <http://updates.pushover.net/post/24408806716/e-mail-to-pushover-gateway>  

[Pushover]: https://pushover.net/
[Boxcar]: https://boxcar.io/
