---
title: Minimal URL encoding
---
I recently stumbled upon [this StackOverflow question](https://stackoverflow.com/q/10111585/118608)
while looking at various ID-generation libraries suitable for use in URLs.

The question asks generally about compressing generic byte data into a URL.
I was thinking more specifically about ID, e.g. compressing a UUID to the
shortest possible representation suitable for use in URLs

The classic answer is to use "base64url" encode (equivalent to classic base64 but using `_-` instead of `+=`).
base64url encoding uses the following alphabet:

    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    abcdefghijklmnopqrstuvwxyz
    0123456789-_

Digging a bit deeper, I found that principally `.` and `~` can be included "safely" anywhere in the URL
giving a "base66" encode:

    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    abcdefghijklmnopqrstuvwxyz
    0123456789-_.~

Having just 2 bits extra, on top of an encoding that is already byte-aligned for every 4 output characters isn't great.
base66 encoding is byte-aligned for every 128 output characters! (losing precious bits in most cases, and almost never
improving on base64 because we have to send whole bytes)


But let's look at all printable ASCII symbols:

    !"#$%&'()*+,-./:;<=>?@[\]^_{|}~`

It's clear that `?`, `/`, and `#` have to be excluded since they have special meaning,
indicating start of query-params, path-separation, and start of hash respectively.
The hash-part never gets sent to the server, but principally you could do
some custom implementation server-side that looks at the raw request path
ignoring the "directory" separators and leaving the query string unparsed
so that `/` and `?` could be used. However that is not the goal of this exercise.

This leaves us with:

    !"$%&'()*+,-.:;<=>@[\]^_{|}~`

Let's test what happens to these characters in Chrome and Firefox, with
a URL like:

    https://example.org/abc!"$%&'()*+,-.:;<=>@[\]^_{|}~`def


**Firefox**  
Given the URL above, Firefox sends the following request to the server:

    https://example.org/abc!%22$%&'()*+,-.:;%3C=%3E@[/]%5E_%7B|%7D~%60def

Leaving the symbols `!$%&'()*+,-.:;=@[]_|~` unencoded.


**Chrome**  
Given the URL above, Chrome sends the following request to the server:

    https://example.org/abc!%22$%&'()*+,-.:;%3C=%3E@[/]%5E_%7B%7C%7D~%60def

Leaving the symbols `!$%&'()*+,-.:;=@[]_~` unencoded.


Chrome encodes `|` whereas Firefox does not. 
Otherwise they're the same. Both convert `\` to `/`, which is why I've left it out
of the "unencoded" character set.

Even though `%` isn't encoded when it stands by itself, it cannot be used in a
general algorithm since it could be followed by numbers or letters and thus
interpreted as a percent-encoded character. Using it in the way shown above
also logs an error in the Chrome console when the page is loaded.

I give you the 81 character alphabet of "URL-kludged base81":

    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    abcdefghijklmnopqrstuvwxyz
    0123456789!$&'()*+,-.:;=@[]_~

_Please don't use this in production. I'm sure both the URLs and the code below
will fail in spectacular ways with just a modicum of exposure to the real world._

_A small example is that [Github-Flavored Markdown will not include the last character
in the URL when autolinking] if it is one of `?!.,:*_~` (but will gobble up
any non-space characters before that as part of the URL).
Note that since `_` is listed here this is also a small problem for normal base64url encoding._

_More importantly is that the infrastructure you rely on probably isn't
well-equipped to handle these "slightly off" URLs, leaving you to deal with all
sorts of weird edge-cases._

[Github-Flavored Markdown will not include the last character in the URL when autolinking]: https://github.github.com/gfm/#extended-autolink-path-validation

### Sample code for UUIDs

```python
def encode(number, alphabet):
    result = ''
    len_alphabet = len(alphabet)
    while number > 0:
        result += alphabet[number % len_alphabet]
        number = number // len_alphabet

    return result[::-1]


def decode(encoded_string, alphabet):
    number = 0
    len_alphabet = len(alphabet)
    for i, c in enumerate(reversed(encoded_string)):
        number += alphabet.index(c) * len_alphabet ** i

    return number

from uuid import uuid4

base81_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$&'()*+,-.:;=@[]_~"
print(encode(int(uuid4()), base81_alphabet))
# Example outputs: 
# _6_Y)[XoG$,~La4D-a$(
# Bd!9&pAmXN$4lG7JV=wa3
# BXhczgO*'A=WTZoQPXIZR
# BdJoptB:Jxq2G]7PAe:mE
# IVDEUIN;n=GYQE0W6Jdp
```

### Notes

- A normal UUIDv4 will have 6-bits that are always the same, taking the information to be encoded down from 128-bits to 122-bits.
  This is not considered in the above writing.

### Links

- Two other interesting StackOverflow questions on UUIDs specifically: [1] and [2]  
  Question 1 has an answer getting to a "base74" encoding, which in practice performs about the same my "base81".  
  Question 2 has an answer that suggests using printable unicode characters, giving compression in text but not over-the-wire (which is actually fine for my usecase). One of the issues with that scheme is that users might get confused when they copy/paste the URL and get the encoded version.  

[1]: https://stackoverflow.com/q/31297985/118608
[2]: https://stackoverflow.com/q/39262193/118608