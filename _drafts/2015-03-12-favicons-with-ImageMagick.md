2015-03-12-favicons-with-ImageMagick.md
---
layout: post
title: Make a favicon.ico with ImageMagick
---


    convert icon.png                \
       \( -clone 0 -resize 16x16 \) \
       \( -clone 0 -resize 32x32 \) \
       -delete 0                    \
      favicon.ico

As of 12th of March 2015 Apple has a `favicon.ico` at the root of [apple.com]
with two sizes `16x16` and `32x32` pixels. But with 16, 32, 16, 32 with the
first two layers having a white "glow" or "border" around them. Possible
to support browser that have white background but don't support transparency.
The two first layers (with the white glow) are 8-bit and the two second are
32-bit.

Google.com has the same tactic (file at root of domain, size: 16 and 32px), but
don't do the "trick" with the surrounding white glow. Both are 32-bit.

References
----------
* http://www.jonathantneal.com/blog/understand-the-favicon/
* http://www.creativebloq.com/illustrator/create-perfect-favicon-12112760
* http://blog.teamtreehouse.com/how-to-make-a-favicon
* https://www.tsohost.com/blog/a-101-guide-to-creating-a-cross-browser-favicon
  A list of browsers and favicon formats



[apple.com]: http://www.apple.com/favicon.ico