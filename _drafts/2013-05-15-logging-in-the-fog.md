---
layout: post
title: Logging in the fog
---
So we decided to go with AppFog as our PaaS.

Sometimes something in your code or setup doesn't work.
An exception is thrown or some other type error occurs. If you have a proper
setup this is logged. Somewhere. On your own server you can look in `/var/log`
for the proper logfile. But in a PaaS you don't have access to the file system
or SSH. On AppFog you can use their CLI tool `af logs \<appname\>` which will,
after a couple of seconds, print an aggregation of logs (deployment logs and
logs from the running app). Although it is useful when getting your app up and
running – this isn't really a viable option in production, where a user action
could have triggered the error at any point in time.

AppFog has the add-on _Logentries_ for *real* logging. This give you a graph
over the log events, and categorizes events and exceptions. But it is way too
difficult to read and search the logs.
So no go to <https://logentries.com> and on to better things.

I found the following suitable _Log-in-the-cloud_ solutions:

* Loggly
* Papertrail

> (also
> * Loggr.net
> * Splunk
> )

### Papertrail
Didn't show any newlines in my Python stacktraces, which makes them pretty
difficult to read.
This is, I guess, because it uses the syslog interface which where each entry is
a single line.

### Loggly
Loggly has a very cool interface and are very focused on searching and the value
of the data that can be extracted from logs.

#### Exceptional
I also tried out [Exceptional](https://exceptional.io) which I liked a lot, but
only does exceptions, not logs. Very easy to set up with Django and very
intuitive interface.

References:

- [Chris Moyer's "The Great Search for syslog services](https://blog.coredumped.org/2011/12/great-search-for-syslog-services.html)
- <https://bitmechanic.com/2012/01/06/centralized-logging-in-10-minutes.html>
 - I also had a [short conversation](https://mattdoesstuff.wordpress.com/2013/02/07/logging-and-application-performance-management-options/) with **mattdoesstuff**.