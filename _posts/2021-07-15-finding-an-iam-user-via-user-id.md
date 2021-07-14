---
layout: post
title: Finding an AWS IAM user via User Id
---

In the previous blog post I talked an AWS IAM User ID that I found in AWS S3 bucker policy.
This is a little follow-up on that.

AWS IAM User IDs always start with `AIDA` and are
21 characters long:

    AIDAXXXXXXXXXXXXXXXXX

So if you have one of these, you probably want to figure out which IAM user it belongs to.
For AWS Access Keys, which look very similar, this is easy: just search for the key in the AWS IAM web interface.
Unfortunately, it seems that you can't search by User ID in that same interface.

So how do you figure out which user has the given IAM User ID?

An easy way to do that is to use the `iam list-users` command in the [AWS CLI]:

    aws iam list-users

If there's a lot of output you'll be put into `less` and you can search for the
User ID by pressing "/" and then type in the user ID and press enter.
    
If you have [jq] installed you can do:

    aws iam list-users | jq '.Users[] | select(.UserId == "AIDAXYZABCDEF12345678")'

to get the user you're looking for.
    
[AWS CLI]: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
[jq]: https://stedolan.github.io/jq/
