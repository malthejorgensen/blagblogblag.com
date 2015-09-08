---
layout: post
title: Azure Storage continued...
---
Part of my backup is a bunch of git repositories. Git stores everything (mainly revision history) in object files.
A LOT of object files.

A simple git repository (51 MB with images, etc.) adds up to around 6100 files.
Cyberduck estimates it would take 6 hours to upload. While that estimate is definitely wrong,
it would take Cyberduck a long time to upload all those files.

My hope was to somehow work directly with the storage and upload and then unzip a bunch of
files containing the git repositories, thus circumventing the slow individual file upload.

Sensibly enough, that's not possible – as far as I know: The only way to interact with the store
is through the donwload/upload/delete API. You cannot modify the files or "drive" directly.

A quick test with Amazon S3, showed me similarly slow uploads in Cyberduck.
