---
layout: page
title: Tools I use
---
On this page I list a bunch of (developer) tools I enjoy using in my work and
elsewhere.

## Website monitoring (uptime)
**webcron** is cheap, and sends texts (SMSs) when your website goes down. It
even sends texts to Denmark where I live! This is nice if you run websites for
clients or websites that a lot of people use. ([Link][webcron])

_Alternatives_: [Pingdom] (expensive, but industry leader), [UptimeRobot] (free and
I really like it, but doesn't send texts to Denmark), [monitor.us] (free, sends
weekly statistics (uptime percentage), but doesn't send texts)

[webcron]: http://www.webcron.org/
[UptimeRobot]: http://uptimerobot.com/
[pingdom]: http://www.pingdom.com/
[monitor.us]: http://www.monitor.us/

## Continous integration (git hooks)
**drone.io** is free, integrates with Github, and has simple and intuitive
interface. Doesn't have all the bells and whistles, but I don't need those so
drone.io is just perfect for me. ([Link](http://drone.io))

_Alternatives_: [TravisCI] (a cross between Jenkins and drone.io -- more
advanced, slick UI, but I never tried it), [Jenkins] (free, open source tool
but I don't get the interface and you have to host yourself)

[TravisCI]: http://travis-ci.org/
[Jenkins]: http://jenkins-ci.org/

## SystemRescueCD
This Bootable Linux CD has saved me time and time again. If you mess up your
partition table, if your OS is no longer bootable. It has never failed me.

[Link](http://www.sysresccd.org)

## OS X Utilities

### f.lux
f.lux alters the colors of your display slighty in the evening (actually checks
your position, and when the sun goes down and times the dimming with that).
This helps your internal (biological) clock, so you will get tired at the right
time. _The standards colours of your computer screen are slightly blue-ish which
tells your brain that it is daytime, and that you should be awake._

I really like it and I feel like it works but I can't say for sure.

### Caffeine
Prevents your computer and display from going to sleep (useful for presentations
and reading)

### ScreenShade
At first I didn't see the point of programs like _Shades_, because you really
shouldn't sit in the dark with your computer and never did (back then). But
sometimes you may, and those times it's nice to have screenshade so your retinas
don't burn from your bright, bright computer screen.


### Window managers
Having trouble finding that Finder window buried beneath your browser and editor
windows? On Linux there's [xmonad], [awesome] and [dwm] (and others).
Now you can get similar functionality on OS X.

[xmonad]: http://xmonad.org
[awesome]: http://awesome.naquadah.org/
[dwm]: http://dwm.suckless.org/

#### Amethyst
[Amethyst] A tiling window manager like [xmonad] for OS X.
It often fails to layout windows, for example it likes to fill the screen with a
MacVim window even though the current layout should actually be two-split
vertical with MacVim and Safari.

[Amethyst]: http://ianyh.com/amethyst/

#### xnomad
[xnomad] uses private API calls meaning that is a bit of a hack.
And for the time being doesn't work on Mavericks (OS X 10.9).
xnomad is the inspiration for Amethyst.

[xnomad]: https://github.com/fjolnir/xnomad

#### osxmonad
[osxmonad] is a wrapper of xmonad for OS X.

osxmonad depends on xmonad which again depends on X11. So first install X11 for Mac
([XQuartz]). Next install the Haskell library for X11.

The XQuartz installs X11 in `/opt`, this means you need to install the Haskell X11
library like this:

    CPPFLAGS="-I/opt/X11/include" LDFLAGS="-L/opt/X11/lib" cabal install X11

It also means that when you run `xmonad` you need to have `/opt/X11/bin` in your
`$PATH` and needs to occur in before `/usr/X11/bin` in the `$PATH`.
Otherwise running `xmonad` will ask you to install `X11` (even though you already
installed it) since the binaries in `/usr/X11/bin` are shims that asks you to install
X11.

[XQuartz]: http://xquartz.macosforge.org
[osxmonad]: https://github.com/xmonad/osxmonad
