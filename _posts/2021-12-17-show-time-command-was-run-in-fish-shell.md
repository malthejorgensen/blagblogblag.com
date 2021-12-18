---
title: Show the time a command was run in fish shell
---
I've been seeing that other people can get their shell to show the time a command
was run ([Bash], [zsh 1], [zsh 2]):

    ~ $ python mgmt_script.py                                                  10:45
                                           This thing ────────>─────────>────────┘

As an avid user and big fan of [fish], I naturally have been wanting to do the same.

Initially, I researched a bit and basically gave up since it looked like fish didn't
have the necessary functionality to implement such a thing.
Instead I ended up having `fish_right_prompt` print `date '+%H:%M'`. This works okay
but it leaves a stale timestamp when your terminal has been sitting for a while
and you then execute a command. The timestamp that's there is really the time when
the last command finished, rather than the timestamp of when you ran the command
the timestamp is next to.

_Sidebar:_ Really, we should have richer terminals/shells anyways -- with output
that's collapsible and auto-saved to a temporary output history so that you can use
it similarly to `!!`. And being able to hover a command to see the duration
plus time of start and end of execution.

Circling back to the problem now, one and half years later I found 
`function event_handler --on-event fish_preexec` (and `fish_postexec`), which
allows me to do the thing I want:

    function reprint_prompt --on-event fish_preexec
        echo -e "\033[F\033["(math $COLUMNS - 4)"G"(date '+%H:%M')
    end

The teensy bit of ANSI escape code-magic here is:

- `\033[F`: Move cursor to start of previous line (current prompt)
- `\033[<$columns>G`:  Move cursor <$columns> characters forwards

In my own `config.fish` I call `fish_right_prompt` directly instead of `date '+%H:%M'` to
keep the two in sync. If you do the same, you should match  `math $COLUMNS - 4` accordingly.
If your right prompt has variable length you can do something like:

    function reprint_prompt --on-event fish_preexec
        set -l _right_prompt (fish_right_prompt)
        set -l _len_right_prompt (string length $_right_prompt)
        echo -e "\033[F\033["(math $COLUMNS - $_len_right_prompt + 1)"G$_right_prompt"
    end

If you have stuff like the git branch in your prompt and you want that to reflect the state
it was in when the command was run, you can do that with this monstrosity:

    # Update prompt when executing a command
    #
    # This makes it so that the "fish_right_prompt" states the time that the command
    # was actually run, rather than when the prompt was printed.
    # Also the current git branch is updated to what it was at the time when command
    # was run, rather than the git branch from when the prompt was first printed.
    function reprint_prompt --on-event fish_preexec
        # Go to previous line (current prompt)
        echo -n -e "\033[A" 
        # Clear line and print current time
        echo -n (string repeat --no-newline --count (math $COLUMNS - 6) ' ') (date '+%H:%M' | tr -d '\n')
        echo -n -e '\r'
        # Print prompt (to get current git branch)
        fish_prompt
        # Print the command with syntax highlighting
        fish_indent --no-indent --ansi (echo -n "$argv" | psub) | tr -d '\n'
        # Go to next line (where output is normally printed)
        echo -n -e "\n"
    end

It's slow and flickers a bit when redrawing, and it doesn't work when using Python's `venv`/virtualenv inside
`tmux` (in that failure mode it puts your command on the line after the prompt, rather than next to it).

I've updated the monstrosity to do perform a bit better [in this gist].

[in this gist]: https://gist.github.com/malthejorgensen/c28017b317ee1e9027a361553eb3c2e5

Notes
-----

- Yes, temporary output history doesn't really work for interactive output, or stuff that redraws (progress bars).
  That doesn't matter! You don't need to "replay" that output anyways.
- And yes, there might be security sensitive output. That's why it's a temporary buffer. I'm not sure you need output from more than 30 minutes ago anyways.
  Although I sometimes wish the whole OS state was a recording so that I could go back to a year ago and see how I solved a particular problem.


[Bash]: https://redandblack.io/blog/2020/bash-prompt-with-updating-time/
[zsh 1]: https://stackoverflow.com/q/13125825/118608
[zsh 2]: https://stackoverflow.com/a/17915260
[fish]: https://fishshell.com/
