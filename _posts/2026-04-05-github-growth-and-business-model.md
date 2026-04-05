---
layout: post
title: Is Github’s business model still viable?
---
People are dunking on Github. “Zero 9’s uptime”. And yeah [it's not great].
But people are misunderstanding what’s going on. Blaming it on the Microsoft
takeover or on Github letting go of key staff members. That may be part of
it. But I’d say they’re sideshows to the main act.

[it's not great]: https://damrnelson.github.io/github-historical-uptime/

Let me explain. Below are recent plots of growth in key numbers from Railway and Render.

<div style="float: left; width: 50%">

<!-- ![Railway's growth](/img/2026-04-05-github-growth-and-business-model/railway_growth.png) -->
<img alt="Railway's growth" src="/img/2026-04-05-github-growth-and-business-model/railway_growth.png">

<!-- Railway [@JustJake](https://x.com/JustJake/status/2029288508402311404) (CEO at Railway) -->
</div>


<div style="float: left; width: 50%">

<!-- ![Render's growth](/img/2026-04-05-github-growth-and-business-model/render_growth.png) -->
<img alt="Render's growth" src="/img/2026-04-05-github-growth-and-business-model/render_growth.png">

<!-- Render [@anuraggoel](https://x.com/anuraggoel/status/2032939764601729537) (CEO at Render) -->
</div>

See that almost vertical line starting around Jan 2026? What happened? Claude
Code happened, vibecoding happened. Code produced by matrix multiplications
happened. Way more is being built, and being built way faster.

Now, having something on Railway or Render means you actually cared enough to
spin up a server. Most vibecoding is not that. There’s no deployment for
gstack (Garry Tan’s ultravibed thing) nor any server hosting necessary for
nanogpt or autoresearch. But there is a Github repository for all of those,
plus one for everyone and their mom’s vibecoded home-project.

Here’s Pete Steinberger (of OpenClaw fame):

![Pete Steinberger's contribution graph on Github](/img/2026-04-05-github-growth-and-business-model/steipete_contrib_graph.png)

Credit to @asishcodes on Twitter (and probably many others) for pointing this ridiculous stat out.

So, imagine those growth plots, just 10x the slope AND 1000x the initial size
(yes really, 1000x)$^1$. Now you have the plot for Github. This is growth at
an unfathomable scale. Today, there are both more users pushing to
Github **and** every user on the platform is pushing way more code, more
frequently. All due to coding agents.

Github is experiencing IMMENSE growing pains. It’s no laughing matter. There’s
nothing to dunk on there. This is an org that is already handling absolutely
immense volume, and now that volume is probably doubling or tripling within a
very short timeframe.

Okay, and what does all that have to do with their business model?

**The OG business model**

Historically, Github has basically been a tiered freemium model – and at the
most basic level it still is. The freemium model thinking is – free usage is
a gateway to paid tiers, and those basically sponsor the free tier. That made
sense in the olden days – for one, back then you actually had to type in
something – with your hands – to put something on Github. Which meant that
the ratio of hobby-projects to professional-projects was modest. 10:1 maybe?
There was only so much free time to manually type into files in a repository.
And at work you wanted a private repo with CI, and that costs money. And so
Github made money.

Fast forward to today, the amount of hobby projects is skyrocketing. It takes
Claude five minutes to put up a Tetris clone, but it’s hexagonal and the
blocks are coming in from all sides. Whereas building a business takes time.
And you’re not gonna go on a paid plan for Hextris, because it’s not a
business it’s just a hobby project that’s not making any money. And you might
say “But it’s much easier to make money in the era of LLMs” — but it’s
nothing compared to how much easier producing code has become. If anything,
there’s probably going to be *less* need for something like Github
Enterprise – likely the main revenue and profit driver for Github – because
teams are getting smaller, there’s less on-premise need, and just generally
fewer big-corporaty setups because everyone can just vibecode their SaaS.
They don’t need a 100 person dev team to build Okta or Hubspot anymore$^2$.

So, the core Github business model has died. *That* business model is no
longer viable.

**The business model REDUX**

The new business model foregoes all that. Github is now a data play. Ingest
and store as much code as you can, and have it be training data for models.
Use the data to build Copilot and sell it.

Data plays can be quite good business, just look at the Reddit + OpenAI deal.
Not good for users, but good for business.

For Github in particular, there are lots of caveats to that of course – most
of the code is open source — OpenAI and Anthropic have ingested it already
and will continue to ingest it so there’s no way to monetize. And is it even
valuable data if all the new code is vibecode anyways? You can’t teach a
model to be better at coding by having ingest code it produced itself. Even
if you could, you wouldn’t need to go through Github$^3$.

I think that’s a fairly sound business strategy. I don’t like – if you’re not
paying, you’re product – but definitely is a sound business strategy
(Google, Facebook, …).
