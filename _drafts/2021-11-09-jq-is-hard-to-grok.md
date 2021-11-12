---
title: jq is hard to grok
---
I have with `jq` what a lot of people have with regular expressions. I need to look it up every time I use it.
Regexes I usually get right on the first or second try -- my brain just "gets it".
However, my brain definitely does not grok `jq`.

My use of `jq` involves a lot of frustation and _a lot_ of trial and error.

Let's look at a small example file `example.json`:

```json
[
  { "name": "Jane Doe", "age": 55 },
  { "name": "John Doe", "age": 41 }
]
```

Let's say I want the first element of the list. Let's try

    > jq '[0]' example.json
    [0]

Nope, that just gave me the literal list `[0]`. Makes sense, okay -- let's try
telling `jq` explicitly to work on the data we gave it with `.`:

    > jq '.[0]' example.json
    {"name": "Jane Doe", "age": 55}

Yay! 
Okay, now what if I want the length of the list?

    > jq '.length' example.json
    jq: error (at example.json:4): Cannot index array with string "length"

Huh?

    > jq 'length' example.json
    2

Feels a bit inconsistent. But okay.

Often with these kind of "unixy" tools are part of a bigger pipeline, e.g.

    > ps -A | grep node | grep -v grep

(yes, there are smarter ways to do that)

Here I'm grepping all running processes for "node", and then filtering out the "grep"
process itself.

Let's try that with `jq` using this example file `example2.json`:

```json
{
  "app_name": "Traffic proxy for Time Capsule",
  "container": "Docker",
  "collaborators": [
    {"name": "Jane Doe", "age": 55, "permissions": ["write collaborators", "write code"]},
    {"name": "John Doe", "age": 41, "permissions": ["read collaborators", "write code"]}
  ]
}
```

Let's try to get the collaborators who are above 50 years old:

    > jq '.collaborators' example2.json
    [
      {"name": "Jane Doe", "age": 55, "permissions": ["write collaborators", "write code"]},
      {"name": "John Doe", "age": 41, "permissions": ["read collaborators", "write code"]}
    ]

    > jq '.collaborators' example2.json | jq 'select(.age > 50)'
    jq: error (at <stdin>:18): Cannot index array with string "age"

Previously, we saw that the list "length"-operator shouldn't be prefixed with `.`
so I'm trying the same here with the "select"-operator, but that doesn't work.

Various combinations of `.` and `[]` also don't work, these all fail:

    > jq '.collaborators' example2.json | jq '.select(.age > 50)'
    > jq '.collaborators' example2.json | jq '.[].select(.age > 50)'
    > jq '.collaborators' example2.json | jq '.[]select(.age > 50)'

The right incantation is:

    > jq '.collaborators' example2.json | jq '.[]|select(.age > 50)'
    {"name": "Jane Doe", "age": 55, "permissions": ["write collaborators", "write code"]}

If I bring it together into one command, I have to remove the `.`:

    > jq '.collaborators.[]|select(.age > 50)' example2.json
    jq: error: syntax error, unexpected '[', expecting FORMAT or QQSTRING_START (Unix shell quoting issues?) at <top-level>, line 1:
    .collaborators.[]|select(.age > 50)
    jq: 1 compile error
    > jq '.collaborators[]|select(.age > 50)' example2.json
    {"name": "Jane Doe", "age": 55, "permissions": ["write collaborators", "write code"]}

The problem really is that internally `jq` has two representations. It has "JSON objects"
and then it has "jq lists". This makes things hard to reason about. When do I have 

Here's a "JSON object" (the `select`-operator _does not_ work on this):

    > jq '.collaborators' example2.json
    [
      {"name": "Jane Doe", "age": 55, "permissions": ["write collaborators", "write code"]},
      {"name": "John Doe", "age": 41, "permissions": ["read collaborators", "write code"]}
    ]

And here's a "jq list" (the `select`-operator _does_ work on this thing):

    > jq '.collaborators[]' example2.json
    {
      "name": "Jane Doe",
      "age": 55,
      "permissions": [
        "write collaborators",
        "write code"
      ]
    }
    {
      "name": "John Doe",
      "age": 41,
      "permissions": [
        "read collaborators",
        "write code"
      ]
    }

Note that there's no surrounding `[` and `]` and there's no comma between the two elements.
Initially, I was planning call these lists "UNIX lists". But the output of UNIX
tools (`grep`, `sort`, `uniq`) is line-based and although similar, "jq lists" are not
line-based.

[gron] is really the UNIX-tool for JSON: "Do one thing and do it well" plus
line-centric output.

One of the things that has been tripping me up is that jq is command-line biased
this means that there are really two internal representations -- one with 
"newline" separated records (for the command line) -- and one that is pure JSON.
Knowing when you're in JSON-land and when you're in command-line land is not
easy to keep track of, and adds to the mental gymnastics required when writing a
script.

[gron]: https://github.com/tomnomnom/gron

### Notes
- Yes, regular expressions formally has a different meaning. You're being obtuse,
  of course I mean some form of extended regexes or PCREs.

- I've formatted the output from `jq` in slightly more compressed format to make the
  blog post. The actual JSON output is equivalent except for the whitespace.

- Yes, there are better ways to do `ps -A | grep node | grep -v grep`, but that's
  not the point. In the same vein I'd say there's a certain pleasure in writing `cat file.txt | wc -l`
  rather than `wc -l file.txt`. Just like I don't need to optimize every little
  thing when I'm cooking pasta for myself at home, I don't need to optimize a
  command that iterates over a couple thousand lines in a text file.
