---
layout: post
title: Getting SSH to choose the right key
published: true
---

On Bitbucket I have a work user and a personal user.
This morning trying to push a project where my work user is a member, failed:

    > git push
    conq: repository access denied.
    fatal: Could not read from remote repository.

    Please make sure you have the correct access rights
    and the repository exists.

The git remote looks like this:

    > git remote -v
    origin  git@bitbucket.org:<WORK_PROJECT>/<WORK_PROJECT>.git (fetch)
    origin  git@bitbucket.org:<WORK_PROJECT>/<WORK_PROJECT>.git (push)

I even set up `~/.ssh/config` to make sure my _work_ SSH key (associated with my _work_ SSH user)
is being used on bitbucket.org:

    > cat ~/.ssh/config
    Host bitbucket.org
        IdentityFile %d/.ssh/<KEY_WORK>


Bitbucket's troubleshooting suggests `ssh -T git@bitbucket.org` to check if
authentication is working

    > ssh -v -T git@bitbucket.org

    OpenSSH_5.6p1, OpenSSL 0.9.8za 5 Jun 2014
    debug1: Reading configuration data ~/.ssh/config
    debug1: Applying options for bitbucket.org
    debug1: Reading configuration data /etc/ssh_config
    debug1: Applying options for *
    debug1: Connecting to bitbucket.org [131.103.20.167] port 22.
    debug1: Connection established.
    debug1: identity file ~/.ssh/<KEY_WORK> type 1
    debug1: identity file ~/.ssh/<KEY_WORK>-cert type -1        <----   Yup, this is what I want, my work key being used

    ... protocol negotiation and fingerprint ...

    debug1: Authentications that can continue: publickey
    debug1: Next authentication method: publickey
    debug1: Offering RSA public key: ~/.ssh/<KEY_PERSONAL>      <----   Wait, what?
    debug1: Remote: Forced command: conq username:malthejorgensen

    ... ssh extensions ...

    debug1: Authentication succeeded (publickey).
    Authenticated to bitbucket.org ([131.103.20.167]:22).
    
    ... entering interactive session, setting environment...
    
    logged in as malthejorgensen.                               <----   My personal user :(

    You can use git or hg to connect to Bitbucket. Shell access is disabled.
    
    ... bla bla bla, many bytes were sent ...
    
    debug1: Exit status 0

As we can see SSH sees in my configuration that `KEY_WORK` should be used, and
yet it ends up authenticating with `KEY_PERSONAL` and logs me in as my
personal user.

The problem is the `ssh-agent`, and that `KEY_WORK` is not added to it. We can
check that as follows:

    > ssh-add -l
    2048 09:c1:32:4a:e7:c2:05:6b:4e:52:71:aa:b8:ee:3e:53 ~/.ssh/KEY_PERSONAL (RSA)

Which shows that only `KEY_PERSONAL` is known to `ssh-agent`. We can add
`KEY_WORK` to ssh-agent like this:

    > ssh-add ~/.ssh/KEY_WORK
    Identity added: ~/.ssh/KEY_WORK (~/.ssh/KEY_WORK)
    > ssh-add -l
    2048 09:c1:32:4a:e7:c2:05:6b:4e:52:71:aa:b8:ee:3e:53 ~/.ssh/KEY_PERSONAL (RSA)
    2048 08:5b:1e:8e:a8:7d:06:61:dc:07:42:7b:ca:b7:49:bd ~/.ssh/KEY_WORK (RSA)

We can see that both keys are now known to `ssh-agent`.
And now -- it works:

    > ssh -T git@bitbucket.org
    logged in as malthe-at-socialsquare-dk.

    You can use git or hg to connect to Bitbucket. Shell access is disabled.

In some cases you have to remove your personal key from `ssh-agent` (you can
always re-add it later). You can remove it with `ssh-add -d ~/.ssh/KEY_PERSONAL`.

**References**

* <https://confluence.atlassian.com/display/BITBUCKET/Troubleshoot+SSH+Issues#TroubleshootSSHIssues-Usingasinglekeywithoutaconfigfile%28MacOSXandLinux%29>
* <https://stackoverflow.com/questions/10901102/bitbucket-trying-to-push-but-i-get-master-conq-repository-access-denied-fa>