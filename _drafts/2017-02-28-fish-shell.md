
Fish shell gotchas
------------------

    mongo (expand_to_mongo_args.sh 'mongodb://username:password@example.org:12345/mydb')

if `expand_to_mongo_args.sh` here expand to multiple options this will be passed as on big option to `mongo`.
Whereas this works perfectly in `bash`

    mongo $(expand_to_mongo_args.sh 'mongodb://username:password@example.org:12345/mydb')

https://github.com/fish-shell/fish-shell/issues/2909
