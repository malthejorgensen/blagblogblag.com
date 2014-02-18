---
layout: post
title: Thunderbird opening links in Chromium
---
Thunderbird on my Arch Linux installion was opening links in Chromium,
even though everything else on the system pointed towards Firefox being the
default browser.

Some people on the internet said to go into `Preferences > Preferences >
Advanced > Config Editor` (yes, that's preferences twice) and add the keys

* `network.protocol-handler.app.http`
* `network.protocol-handler.app.https`

and set their values to `/usr/bin/firefox`.
This, however, did not work.

What _did_ work was to set the keys

* `network.protocol-handler.warn-external.http`
* `network.protocol-handler.warn-external.https`

to `true`. This makes Thunderbird prompt you what program to open every time you
click a link. Here you can choose Firefox, and also check "remember my
choice...".

Reference: <http://www.ghacks.net/2013/01/20/fix-for-thunderbird-not-opening-links/>
