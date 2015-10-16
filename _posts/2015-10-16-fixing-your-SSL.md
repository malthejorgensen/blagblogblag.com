---
layout: post
title: Fixing your SSL
---
Today I discovered a new tool: SSL Labs' [SSL test].

It let's you input your domain URL and then checks the security of your SSL configuration
for known vulnerabilities. After the test it gives you an overall security rating (on the
US school _A-F_ scale) along with a list of recommended changes to fix any security holes
and follow best practice.

Testing on peergrade.io I got a horrendous **F**. The SSL proxy is running on an
old Ubuntu machine, which hadn't been updated in a while, making the SSL setup
vulnerable to the Heartbleed<sup>1</sup> vulnerability. Furthermore as the
SSL-setup was an unconfigured/vanilla setup, POODLE<sup>2</sup>
and other downgrade attacks were also possible.

Updating packages and revising the SSL configuration I got the security rating
up to an acceptable **A**-grading.

I can highly recommend using _SSL test_ to check your SSL setup.
Not only does it point out vulnerabilites but also links to resources on what
the vulnerabilities entail and how to fix them.

<sup>1</sup> _Heartbleed_: http://heartbleed.com/  
<sup>2</sup> _POODLE_: https://en.wikipedia.org/wiki/POODLE and https://www.openssl.org/~bodo/ssl-poodle.pdf

[SSL test]: https://www.ssllabs.com/ssltest/
