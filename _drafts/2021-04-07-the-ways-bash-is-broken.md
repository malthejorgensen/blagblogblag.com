

- `IFS` is the devil's work
- The nested quoting rules are insane
  - Normal `"` and `'` quotes cannot be nested at all
  - Even backslashes do not work
  - However, in process substitution you can nest quotes as much as you want: `myvar="$(echo "crab")" is correct and recommended
- Expanding a variable into multiple command arguments is very difficult
- Arrays are impossible to work with
- It's very easy to accidentally treat an array as a string
