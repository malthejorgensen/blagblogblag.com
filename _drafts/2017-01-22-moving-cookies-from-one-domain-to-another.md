
In most cases a move operation consists of two steps:

1. Copy X to new destination
2. Delete X at old destination

This could in principle be possible with cookies, by
sending two `Set-Cookie`-headers (allowed by RFC 6265)

1. `Set-Cookie: user_id_hmac=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=www.example.org`
2. `Set-Cookie: user_id_hmac=123; Domain=example.org`

However, RFC 6265 also states that

> Servers SHOULD NOT include more than one Set-Cookie header field in the same response with the same cookie-name.

Ideally


https://www.ietf.org/rfc/rfc6265.txt

References:

http://stackoverflow.com/a/24943426/118608
