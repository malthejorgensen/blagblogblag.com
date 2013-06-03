---
layout: post
title: Battle of the PaaSs
---
So what is a _PaaS_?

PaaS stands for _Platform as a Service_ and means that you pay for a service that provides a platform on which your code can run. That could be a Python platform for running webcrawlers, a node.js stack for running web applications etc.

In this context PaaS is an alternative to the usual web hosting setups:

 1. **Regular hosting** You have a user with an FTP directory where you upload your PHP files or the like. _Very easy but not very customizable or scalable._
 2. **Dedicated/virtual server** You have a single server over which you have full control (OS, packages). _Fully customizable, somewhat scalable (larger server)_
 3. **Roll your own cloud solution** Set up instances and HTTP routing on Amazon Web Services. _100% scalable, very customizable_

For the project I'm currently working on I need scalability (multiple instances) and customizability (custom Python packages), which rules out regular hosting (#1) and using a dedicated/virtual server (#2).

Amazon Web Services (#3) of course makes server management pretty easy, but I still don't want to worry about choosing a Linux distribution,  updating packages, and setting up HTTP routing. Therefore using a PaaS is the way to go.

Using a PaaS basically means that you can simply push your code to the service and it will handle deployment, setting up multiple instances and so forth (even installing needed Python packages automatically).

## The contenders

### Heroku
*The grandfather of PaaS*:<!-- and defined what it means to be a modern web PaaS.--> the first widely known and widely used service of this type. It's high quality, very popular, and is still the trend-setting service in this field. All other services mentioned here are more or less watered-down copies of Heroku. Hopefully we will soon see new ideas coming from the competition but right now Heroku is still the driving force of innovation in the field.

**My experience:** Very easy to set up and great documentation.
It took some time deploying the first time (~4 mins), but the service itself is very responsive both through the command line and the web interface.

**Bottom line:** Heroku is great (_the best_), but too expensive.


### dotCloud
A relatively new, but also quite popular PaaS.

**My experience:** Most of the services mentioned here use Amazon EC2 as a backend, including dotCloud. When you need a server on EC2 you "provision" it. The selected OS is transferred to its local storage and keys and DNS is set up. This takes about 8-10 minutes. The other services here have a reserve of instances already booted up and ready so that when you create a new app the service simply need to setup the code and HTTP routing which takes less than five minutes.

BUT dotCloud provisions Amazon instances on demand. And it takes a looooooong  time: more than 30 minutes. 

30 minute wait time is just something that I don't want to -- and don't have to -- deal with.

This *wait problem* would also affect zero-downtime deployment where you typically have two different deployments of
your site running at the same time (one old, one new) and then change the routing from the old one to the new. This provisioning lag would make zero-downtime deployment very time consuming.

**Bottom line:** dotCloud provisions instances on demand, which creates long wait times that other services don't have. *No, thank you* dotCloud.

### Gondor.io
Smaller service focused on Python/Django which seems to fit just my needs. 

**My experience:** For some reason it was very difficult to set up. Whereas the other services only needed a few changes to the Django settings, Gondor needed a lot of tweaking and I never actually succeeded in getting it running.

**Bottom line:** Never worked.

### AppFog vs. cloudControl
That leaves two services: **AppFog** and **cloudControl**.

Setting up with cloudControl was extremely easy, thanks to concise and well-written documentation. The AppFog documentation on Django was a bit more sparse, but setup was still pain-free.

The cloudControl command-line is based on Heroku's command-line tool and is pretty good (Heroku's own is still better), whereas AppFog's is based on cloudFoundry's command-line tool and does have some [minor][1] [problems][2].

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>AppFog</th>
      <th>cloudControl</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Setup</td>
      <td style="background-color:#DAF0DA">Okay</td>
      <td style="background-color:#CFC">Easy</td>
    </tr>
    <tr>
      <td>Command-line</td>
      <td style="background-color:#FFDADA">Half-baked<sup>1</sup></td>
      <td style="background-color:#CFC">Better</td>
    </tr>
    <tr>
      <td>Web interface</td>
      <td style="background-color:#CFC">Good</td>
      <td style="background-color:#FFDADA">Half-baked</td>
      <!-- #FFCACA -->
    </tr>
    <tr>
      <td>Logs<sup>2</sup></td>
      <!--<td style="background-color:#FEF">Slow and difficult</td>-->
      <!--<td style="background-color:#EFE">Okay</td>-->
      <td style="background-color:#FFDADA">Slow and difficult</td>
      <td style="background-color:#DAF0DA">Okay</td>
    </tr>
    <tr>
      <td>Documentation</td>
      <td style="background-color:#FFDADA">Worse</td>
      <td style="background-color:#CFC">Better</td>
    </tr>
    <tr>
      <td>Database<sup>3</sup></td>
      <td style="background-color:#FFDADA">Built-in</td>
      <td style="background-color:#CFC">N/A - outsourced</td>
    </tr>
  </tbody>
</table>

1. `af logs` and `af update` are slower than on most other services but not irritatingly so. Also, you cannot run Python/Django commands on the server, e.g. `python manage.py syncdb` or `python manage.py migrate` which is a pain (you have to manually do these things).

2. AppFog has no online interface for viewing logs and the command-line logs are slow. cloudControl has an online log viewing inferface and their command-line logs are much faster to access.

3. You cannot setup triggers on the AppFog MySQL database. cloudControl doesn't supply any database themselves but outsources them, for example to ElephantSQL which I found pretty great. Of course you can outsource with AppFog as well, but if they can't supply a great database solution – they shouldn't supply one at all – but rather default to outsourcing like cloudControl.

## Bottom line
**cloudControl** is the better service, but their pricing is about double that of **AppFog**. The flaws of AppFog have so far not been deal-breakers for me.

Therefore my choice of _PaaS_ is – for now – AppFog.

#### References

 * [PaaS on Wikipedia](http://en.wikipedia.org/wiki/Platform_as_a_service)
 * **Zero-downtime deployment** means updating your website with zero downtime for the end users (i.e. without "_Website currently undergoing maintenance_"). This is usually achieved by setting the updated version up on separate instances while having the old version still running. The HTTP routing is then shifted from pointing to the old version to the new, and the instances with the old version can then be shut down.

[1]: https://github.com/appfog/af/issues/44
[2]: https://github.com/malthejorgensen/af/commit/dbc3afd028fc7bc87dd5bbbaaf5238d5ffb014a5