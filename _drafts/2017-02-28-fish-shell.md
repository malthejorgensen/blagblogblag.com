---
title: Fish shell gotchas
---
Fish seperates args by newlines, where as bash splits on any whitespace

    mongo (expand_to_mongo_args.sh 'mongodb://username:password@example.org:12345/mydb')

if `expand_to_mongo_args.sh` here expands to multiple options this will be passed as on big option to `mongo`.
Whereas this works perfectly in `bash`

    mongo $(expand_to_mongo_args.sh 'mongodb://username:password@example.org:12345/mydb')

See: <https://github.com/fish-shell/fish-shell/issues/2909>
