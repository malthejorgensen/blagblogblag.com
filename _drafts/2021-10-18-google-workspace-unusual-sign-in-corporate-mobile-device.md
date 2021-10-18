---
layout: post
title: "Google Workspace unusual sign-in corporate mobile device"
---
If you're trying to log in to your Google Workspace acocunt and you get the following message:

> We detected an unusual sign-in attempt. To make sure that someone else isn’t trying to access your account, your organization needs you to sign in using your corporate mobile device (the phone or tablet you normally use to access your corporate account).
> If you don’t have your corporate mobile device with you right now, try again later when you have your corporate mobile device with you. If you continue to have problems signing in, contact your administrator. Learn more
> 
> Go back & use your corporate mobile device

### Solution
I got this message – and I've never had a "corporate mobile device" at Eduflow – and I also couldn't find it by searching the Google Workspace admin.

To allow yourself to log in. Log in as an admin to Google Workspace and go to your user account (here called "John Doe")

Go to Users > John Doe > Security

then go to "Login challenge" and click it, and then click the "Turn off for 10 mins"-button.

<img width="739" alt="Screenshot 2021-10-18 at 13 48 29" src="https://user-images.githubusercontent.com/615776/137725503-118bd00b-91f3-4e3c-aef3-b6272fb2ec10.png">

That's it! You should be good to log in again.
