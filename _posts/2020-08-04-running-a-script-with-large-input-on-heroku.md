---
layout: post
title: Running a script with large input on Heroku
---
Running a script on Heroku is easy:

    heroku run -a <your app> python my_script.py

This runs your script in an environment with access to your
production database, Redis and all the other stuff that.

This can be great for manual data migrations -- say adding
a demo course for all of your users.

However, in some cases you may want to run your script only
for say 5,000 out of 20,000 users. Let's say you've run some data
analytics and you now have the IDs of the 5,000 users that the
script should run on.

You don't want to dirty up the repository with a custom file
with the IDs of exactly those 5,000 users. What if you want to
run the script again with 200 more users in a week?

The first thing you need to do is to allow your script to accept
an input file: `python my_script.py <input file>`.

Now how do you get those 5,000 IDs into Heroku without adding them directly
to the repository?

On Heroku you don't have access to convienient tools like `curl` or `wget`.
But if your app includes the `requests`-library (assuming you have a Python app)
you can do

    python -c "import requests; print(requests.get('https://google.com').text)" > test.txt

and then 

    python my_script.py test.txt

The full session would look something like:

    heroku run -a eduflow bash
    Running bash on ⬢ <your app>... up, run.9942 (Standard-1X)
    ~ $ python -c "import requests; print(requests.get('https://google.com').text)" > test.txt
    ~ $ python my_script.py test.txt

If you don't have access to requests, you can use the built-in `urllib`-library:

    python -c 'from urllib.request import urlopen; print(urlopen("http://google.com").read())'

Here, you'll need to strip the beginning `b'` and ending `'` since it returns a `bytes`-object.

For a Node app you can do something similar with `fetch` or `axios`.
