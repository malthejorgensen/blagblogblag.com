---
layout: post
title: League of Legends on Linux
---
From time to time I play League of Legends with a couple of friends.
After having switched to Linux from OS X, I needed to get it working on Linux as
there's no native client for Linux.

What worked for me was to install it via [PlayOnLinux](http://www.playonlinux.com/).
This worked perfectly until I needed to start an actual game. (Updater, Login,
Lobby etc. worked fine)

After the Character Select countdown, the splash showed and just stuck. Nothing
happened. It never showed the loading screen or the actual game.

The fix for me was to the change the hosts file: `/etc/hosts`.
In this file there should be the following lines (it is the second one that is
important):

    #<ip-address>	<hostname.domain.org>	<hostname>
    127.0.0.1	localhost.localdomain	localhost

Look up your computer's hostname

    > hostname
    macbook-malthe

And then change the line in `/etc/hosts` to this:

    #<ip-address>	<hostname.domain.org>	<hostname>
    127.0.0.1	localhost.localdomain	macbook-malthe

(replacing `macbook-malthe` with your own hostname from before)

Hopefully it will be as pain-free for you as it was for me ;)

_Note:_ When starting the game, the load screen (in fullscreen with the loading
bars and your ping showing) will be stuck for about 1 minute, but don't
worry: the game will start. It did for me at least.

Reference: <http://www.playonlinux.com/en/issue-2219.html>
