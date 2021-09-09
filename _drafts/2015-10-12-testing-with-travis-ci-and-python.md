---
layout: post
title: Testing with Travis CI and Python
---

First login to [Travis CI] with your Github account.

Add a `.travis.yml` in the root directory of your repository.

Running your tests locally
--------------------------
Before we begin make sure that your test run on your own machine, here we are
using `unittest2` to run the tests:

	unit2


Pushing to Github and testing on Travis CI
------------------------------------------
By default Travis CI will try to install your requirements from `requirements.txt`,
(`pip install -r requirements.txt`)

### Not buidling?
You can check if Travis got notified of the push under the _Settings_ button > Requests.
An erroneous `.travis.yml` file will show up as `missing config` and won't trigger a build.




Code coverage and Coveralls.io
------------------------------

    coverage

You can check out the coverage with

    coverage html


References
----------
* https://docs.travis-ci.com/user/languages/python/



[Travis CI]: https://www.travis-ci.org