---
layout: post
title: On the searchability of questions on StackOverflow
---

In a perfect world, every time your searched Google for a programming problems,
the first thing that would pop up would be the perfect StackOverflow question
with the perfect answer. 

Recently I was trying to figure out _How do I drop a MongoDB database using PyMongo?_
Of course, I searched Google, and this is what I got (top 5 results):

* drop a database or collection via pymongo · GitHub (outdated: Only works in PyMongo < 3)
* Remove Data with PyMongo — Getting Started With ... (doesn't contain solution)
* database – Database level operations — PyMongo 3.2.1 ... (doesn't contain solution)
* python - How to delete pymongo.Database.Database object ... (StackOverflow link, contains solution)
* How to drop a MongoDB using pymongo - Quora (top answer is outdated, but second answer contains solution)

The first problem is that the first three results are either outdated or don't contain
a solution.

My preference in these kinds of search usually favors StackOverflow as the
information is readily availble and the solution is often clearly stated.
However, I never clicked the StackOverflow link, thinking that it didn't
contain the answer I was trying to find -- it seemed to be asking a different
question than the problem I was trying to solve.

Relative to Quora for example, StackOverflow is biased toward making the
solution clear and at the top, whereas Quora often is more discussion-like
which makes it more time consuming to find the piece of code or answer you're
looking for.

After clicking all the other links (and not seeing the correct answer further down the page on Quora)
I finally went to StackOverflow. The question is long and winding and not really asking
what I'm asking.

But the answer's there!

Now I start thinking -- how do I help the next gal or guy, having the same problem I did?

I could hope for two things:

1. The title of the question (showing on Google) would immediatly indicate
   that the question contains an answer to my problem
2. The StackOverflow question would be at the top of the search results

Both of these are really about search and searchability of questions.

To remedy the problem, I can either edit the question to give it a title
that better fits my problem (and perhaps remove the "fluff" text/background story)
but I feel that this would be heavy-handed, and I would really taking the
question away from the original asker.

Or, I could ask a new question but that would be a duplicate -- or would it?

To answer this question I went to meta.stackoverflow.com

The Meta discussion
-------------------
This new question, a broad question really, can be split into two parts:

* is it okay to make a duplicate question to improve searchability?
* is it okay to edit a question to improve searchability?

This time, I did a search through StackOverflow's own search.
I found nothing.

So I started writing my question, but as I wrote more questions came up
and I actually found a bunch of questions that were similar to mine:

* [Deliberately opening duplicate questions as search targets](https://meta.stackoverflow.com/questions/290768/deliberately-opening-duplicate-questions-as-search-targets)
* [Should I ask a new question in order to make the answer easier to find?](https://meta.stackoverflow.com/questions/314210/should-i-ask-a-new-question-in-order-to-make-the-answer-easier-to-find)
* [Should I post a question that I'm going to immediately close as a duplicate? \[duplicate\]](https://meta.stackoverflow.com/questions/307615/should-i-post-a-question-that-im-going-to-immediately-close-as-a-duplicate?lq=1)
* [I found an answer but the question was very different from mine. How can I make the answer easier to find for other people?](https://meta.stackoverflow.com/questions/308447/i-found-an-answer-but-the-question-was-very-different-from-mine-how-can-i-make?lq=1)

Even this one is relevant, yet slightly different:

* [On the searchability of the originals of duplicate questions](https://meta.stackoverflow.com/questions/258690/on-the-searchability-of-the-originals-of-duplicate-questions)

It contains the important observation<sup>[4](#footnote-4)</sup> that _if
you're not logged in, you will be redirected to the question not marked as
duplicate_. This is good news for searchability, but bad if the "original"
question is worse than the one marked as a duplicate.

According to meta.stackoverflow this is remedied by the best practice of
marking the "best" of the two questions as the original<sup>[5](#footnote-5)</sup>.

Yes, post the same question **if**:

* it is a better question and has a better answer (in this case 
* it has a markedly different wording 

<!-- 
If it's marked as a duplicate visitors coming to StackOverflow will be
redirected to the "original" question and may dismiss it because its not
asking what the question they're having.

Reference: https://meta.stackoverflow.com/a/258760/118608
-->

<a name="footnote-4"><sup>4</sup></a> <https://meta.stackoverflow.com/a/258760/118608>  
<a name="footnote-5"><sup>5</sup></a>
<https://meta.stackoverflow.com/questions/294805/what-if-my-duplicate-question-is-seemingly-much-better-worded-than-the-origin?rq=1>
or
<https://meta.stackoverflow.com/questions/254755/what-is-the-proper-action-if-duplicate-question-is-better-than-original?rq=1>
or
<https://meta.stackoverflow.com/questions/251938/should-i-flag-a-question-as-duplicate-if-it-has-received-better-answers>
or
<https://meta.stackexchange.com/questions/147643/should-i-vote-to-close-a-duplicate-question-even-though-its-much-newer-and-ha>

