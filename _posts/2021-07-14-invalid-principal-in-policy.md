---
layout: post
title: Finding an AWS S3: Invalid principal in policy
---

The other day I was trying to update an AWS S3 bucket policy, but when trying
to save the policy I got the following error:

    Invalid principal in policy
    
(if you're using [boto] you'll see `botocore.exceptions.ClientError: An error occurred (MalformedPolicy) when calling the PutBucketPolicy operation: Invalid principal in policy`)

The policy looked like this

```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "AIDAXYZABCDEF12345678"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucket-name>/*"
        }
    ]
}
```

The problem was that the IAM user with the User ID `AIDAXYZABCDEF12345678` (example ID here -- not an actual ID) had been deleted.
Changing the User ID to that of an existing user, allowed me to save the policy.

[boto]: https://github.com/boto/boto3
