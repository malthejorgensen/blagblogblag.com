

For file syncing/backups on the desktop, Dropbox seems to be the way to go.
However, as a developer some of the . And git isn't a backup tool. If that were the case
I would have to be committing and pushing all the time. That's not the purpose of git.
git is a collaboration tool, and you should be committing and pushing when you have something
to share with the other developers – or the rest of the world.

So I need to backup my git repositories, each one often containing tens of thousands of files,
quickly accumulation to a large number of small files, which will stall Dropbox syncing for
days<sup>1</sup><sup>2</sup>.

My favorite has been Copy – which unfornunately shut down. My second favorite being CrashPlan.
The problem is that CrashPlan only does backups, and isn't really fit for .
Via their web interface you _can_ extract individual files, but it's cumbersome.

Benchmark
---------
1 million files (a bunch of git folders)

Dropbox
Google Drive
OneDrive
SugarSync



<sup>1</sup> https://www.dropbox.com/help/39
<sup>2</sup> https://superuser.com/questions/1170676/dropbox-slow-syncing-of-many-small-files
