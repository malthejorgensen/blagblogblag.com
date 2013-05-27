---
layout: post
title: Battle of the *PaaS*s
---
So what is a _PaaS_?

PaaS stands for _Platform as a Service_ and means that you pay for a service that provides the platform on which your code runs. 

PaaS is an alternative to the usual web hosting setups:

 - **Regular hosting** You have a user with an FTP directory where you upload your PHP files or the like. _Very easy but not very customizable or scalable._
 - **Dedicated/virtual server** You have a single server over which you have full control (OS, packages). _Fully customizable, somewhat scalable (larger server)_
 - **Roll your own cloud solution** Set up instances and HTTP routing on Amazon Web Services. _100% scalable, very customizable_

So we need scalable (multiple instances) and customizable (custom Python packages), which rules out regular hosting and using a dedicated/virtual server.

Amazon Web Services of course makes server management pretty easy, but I still don't want to worry about choosing a Linux distribution,  updating packages, and setting up HTTP routing. Therefore using a PaaS is the way to go.

Using a PaaS basically means that you can simply push you code to the PaaS and it will handle deployment, setting up multiple instances and so forth (even installing needed Python packages).

## The contenders

### Heroku
The service that started it all and defined what it means to be a modern web PaaS.

**My experience:** Very easy to set up and great documentation.
It took some time deploying the first time, but the service itself is very responsive both through the command line and the web interface.

**Bottom line:** Heroku is great (_the best_), but too expensive. Maybe some other time.


### dotCloud
Seems nice and easy.

**My experience:** dotCloud provisions Amazon instances on demand.
This takes a loooooooooooooong time: more than 30 minutes. 

Most of the other services mentioned here also use Amazon as a backend, but have instances available when you need it, meaning that setting up your app or deploying a new one takes less than five minutes.

The 30 minute wait is just something that I don't want to and don't have to deal with.

The problem would also affect zero-downtime deployment where you typically have two different deployments of
your site running at the same time (one old, one new) and then change the routing from the old one to the new. This provisioning lag would make zero-downtime deployment very time consuming.

**Bottom line:** dotCloud provisions instances on demand which creates long wait times that I simply can avoid by choosing another service. No go.

### Gondor.io
Python/Django focused service which seems to fit just my needs. 

**My experience:** For some reason it was very difficult to set up. Whereas the other services only needed a few changes to the Django settings, Gondor needed a lot of tweaking and I never actually succeeded in getting it running.

**Bottom line:** Never worked.

### AppFog vs. cloudControl

| Category      | AppFog             | cloudControl |
| ------------- | ------------------ | ------------ |
| Setup         | Okay               | Easy         |
| Command-line  | Half-baked[1]      | Better       |
| Web interface | Good               | Half-baked   |
| Logs[2]       | Slow and difficult | Okay         |
| Documentation | Worse              | Better       |

[1] `af logs` and `af update` are slower than on most other services but not irritatingly so.

[2] AppFog has no online interface for viewing logs. cloudControl has an online log viewing inferface.

## Bottom line
**cloudControl** is the better service, but their pricing is about double that of **AppFog**. The flaws of AppFog have so far not been deal-breakers for me.

Therefore my choice of _PaaS_ is (for now) AppFog.