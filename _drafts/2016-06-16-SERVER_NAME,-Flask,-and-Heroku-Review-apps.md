---
published: false
---
---
title: SERVER_NAME, Flask, and Heroku Review apps
published: false
---

tl;dr
If you're using Flask's `SERVER_NAME` and Heroku's "Review Apps" at the same time,
and your pages are 404'ing, include the following in your `app.json`:

	# app.json
    "env": {
	  ...
      "SERVER_NAME": "**PLACEHOLDER**",
      "HEROKU_APP_NAME": {
        "required": true
      }
      ...
    }
    
and the following in your Flask config: 
   
    # config.py (Flask config)
    if os.getenv('SERVER_NAME') == '**PLACEHOLDER**' and os.getenv('HEROKU_APP_NAME'):
        SERVER_NAME = '%s.herokuapp.com' % os.getenv('HEROKU_APP_NAME')
    elif os.getenv('SERVER_NAME'):
        SERVER_NAME = os.getenv('SERVER_NAME')
    else:
        SERVER_NAME = 'localhost:5000'


Background (Flask's `SERVER_NAME`)
----------------------------------
Running Flask in a production environment you often want to set the
config variable `SERVER_NAME`.

This config variable is used when creating absolute URLs (URLs that include your domain), e.g.:

    url_for('user_profile')                 # will return '/profile'
	url_for('user_profile', _external=True) # will return 'https://example.org/profile'
    
In our app we use the `_external` argument when sending emails out to our
users in our background worker process.
Here the URLs need to be absolute, but as the emails are being sent in the
background workers, there's no request context so we need the `SERVER_NAME`
config variable to be set<sup>1</sup>.

But, when setting `SERVER_NAME` Flask also 404's on requests not matching the set
`SERVER_NAME`.

Heroku Review apps
------------------
For us this is problematic as we use Heroku's "Review Apps"<sup>2</sup>.

We can set `SERVER_NAME` on our staging and production server, but we
don't want to change it for every Review App we create – an "Review App"
is created automatically every pull request in our Github repository,
with it's config inherited from the staging app.

However, you can let server know the domain given to the app via the
`HEROKU_APP_NAME` environment variable, which is exposed if you
specify the following in the `app.json`-file in the root of your
repository:

    "env": {
	  ...
      "HEROKU_APP_NAME": {
        "required": true
      }
      ...
    }
    
However the `SERVER_NAME` variable is also inherited by the parent app
– in our case the staging server – meaning that we still end up with a
`SERVER_NAME` that will 404 requests to our Review App.

Our solution was to set a default "shim" `SERVER_NAME`, which is
overridden in the production and staging apps (in the Heroku config):

	# app.json
    "env": {
	  ...
      "SERVER_NAME": "**PLACEHOLDER**",
      "HEROKU_APP_NAME": {
        "required": true
      }
      ...
    }

and then if the shim `SERVER_NAME` is detected we override it with
a value that works for the Review App. We do this in our Flask
config:

    # config.py (Flask config)
    if os.getenv('SERVER_NAME') == '**PLACEHOLDER**' and os.getenv('HEROKU_APP_NAME'):
        SERVER_NAME = '%s.herokuapp.com' % os.getenv('HEROKU_APP_NAME')
    elif os.getenv('SERVER_NAME'):
        SERVER_NAME = os.getenv('SERVER_NAME')
    else:
        SERVER_NAME = 'localhost:5000'

Here we also include a fallback to localhost, if nothing is specified, making
things "as expected" on our local dev maching.

References:

<sup>1</sup> https://flask.pocoo.org/docs/0.11/config/#builtin-configuration-values (See `SERVER_NAME` in the table)  
<sup>2</sup> https://devcenter.heroku.com/articles/github-integration-review-apps  
