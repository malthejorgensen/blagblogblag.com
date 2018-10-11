You can't serve your service worker via a CDN. You can't even serve it on a subdomain of your current domain.

That means you can't use PDF.js via a CDN (at least not with the built in worker).[2]

Why can't it be solved with CORS?
---------------------------------
Normally, things that require the same-origin policy can be solved with CORS.
However, that doesn't make sense in this case (and is therefore not allowed).

The same-origin policy was initially created for XHR and Fetch, to make sure that my site `evil.org`
couldn't make an XHR to `your-bank.com/api/account/balance` and leak information that way.

For that reason, it became required to set CORS headers on sites that allowed "remote access".
This means `your-bank.com/api/account/balance` is safe by default, as long as they don't
set an HTTP header like `Access-Control-Allow-Origin: *`. For sites carrying non-confidential information
setting a CORS header like that is perfectly fine.

Now, this doesn't work for Service Workers as the path of attack would be to inject
my `evil.org/worker.js` Service Worker script into a trusted site `trusted-example.org`.
If CORS was allowed I could simply set `Access-Control-Allow-Origin: *` on `evil.org`,
and I would now have injected my service worker onto `trusted-example.org`, and 
due to the nature of service workers, I now have permanent control over that
user's access to `trusted-example.org` (all network traffic would go through
my service worker).

I believe we need either an untrusted or semi-trusted worker type, or 

CSP to the rescue
-----------------
CSP is the dual opposite of CORS, allowing the server where the request originates
control whether the browser should be allowed to access certain domains.

Sounds familiar?

Well, CSP is the perfect fit for allowing e.g. service workers to be loaded from
certain trusted domains. And it would seem that somebody thought of this, as we
now have the `worker-src` directive.

However, it doesn't work.

There is no resolution. The web sucks.

References
----------
* https://stackoverflow.com/a/31883194/118608

[1] https://github.com/w3c/ServiceWorker/issues/940
[2] https://github.com/mozilla/pdf.js/issues/5490
