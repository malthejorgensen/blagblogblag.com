UMD and CommonJS
----------------
Actual CommonJS compatibility was broken by a PR that was made to ensure
the `exports`-variable wasn't a DOM node from the browser (Nodes in your DOM
with `id`-attributes are promoted to global variables in JS, so `<div id="exports">`
would break the CommonJS import<sup>2</sup>). But the PR at the same time replaced many occurences
of the CommonJS compliant `exports`-variable, with the Node.js standard `module.exports`.

PR merge commit: https://github.com/umdjs/umd/commit/b4c112acf6db4a6c970048a16d7c42ea3401b254


<sup>2</sup> <http://stackoverflow.com/a/41303288/118608>

CommonJS era package managers
-----------------------------

https://github.com/tlrobinson/narwhal
