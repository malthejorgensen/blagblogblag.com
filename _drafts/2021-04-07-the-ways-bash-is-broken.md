

- `IFS` is the devil's work
- The nested quoting rules are insane (take a look at [this](https://unix.stackexchange.com/questions/118433/quoting-within-command-substitution-in-bash)
  - Normal `"` and `'` quotes cannot be nested at all
  - Even backslashes do not work
  - However, in process substitution you can nest quotes as much as you want: `myvar="$(echo "crab")" is correct and recommended
- Expanding a variable into multiple command arguments is very difficult
- Arrays are impossible to work with
  - Normally `"` means "don't expand into multiple args" even if there's whitespace, but for arrays you _need_ `"` when expanding the array in to multiple args
    (See [this SO post](https://stackoverflow.com/questions/66071810/how-can-i-satisfy-shellcheck-without-causing-script-failure))
- It's very easy to accidentally treat an array as a string
- `set -e`, `set -o pipefail`, `set -u` seem to be needed in every script (ShellCheck doesn't have a rule for this)
- Proper integer variables would go a long way
- Not having special "commands" for if statements `-z`, `-n`, `-e` and so on.
- Shellcheck suggest using `mapfile` but that isn't available on older Bash, e.g. the one installed on macOS ([Link](https://stackoverflow.com/questions/41475261/need-alternative-to-readarray-mapfile-for-script-on-older-version-of-bash) and [the Shellcheck docs](https://github.com/koalaman/shellcheck/wiki/SC2206))
