---
title: Migrating mail from a Google Apps account to a Gmail account
type: post
---

_The follwing is short description of what I did to backup all mail from a Google Apps account (e.g. `malthe@awesomecompany.com`) to my personal Gmail (e.g. `malthe3141592@gmail.com`)_.

First enable POP3 on the account you want to import from:

1. Go to `Settings > Forwarding and POP/IMAP`
2. Choose _Enable POP for all mail_
3. This can take up to 2 hours to take effect

Then on the account you want to import into:

Go to `Settings > Accounts and Import`  
Click `Import mail and contacts`  
Enter your account email (the account you're importing from) and password as requested.

_Note: If you have two-factor authentication or other security enhancements enabled on the account
you're importing from, you most likely need to create an "App Password"
and use that here._

For the `POP username` use the full email address (e.g. `malthe@awesomecompany.com`)  
For the `POP server` use `pop.gmail.com`  
Next to POP server, click _Edit_ and choose port 995 and _Use SSL_.

Now for the weird part:  
In order to get this to work I had to uncheck `Leave a copy of retrieved message on the server` -- I had been getting the the error message `This account cannot be imported right now. Please try again later.` for 4-5 hours at that point.

### References

* https://productforums.google.com/d/msg/gmail/YUEX3fkIIpM/XudShcUEmHgJ
