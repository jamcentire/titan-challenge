## Application overview and specifications

This application is an MVP in-browser image viewer comprising the following core functionality:

1. Retrieves a multi-page pdf image in S3
2. Loads and displays this pdf one page at a time in the browser
3. User may navigate one page forward or backward, go to the first or last page of the document, or jump to specified page number

Time-to-load for the first page should be brief (under 2 seconds, and under 1 ideally)

After the first page load, time to load future pages should be lower (<0.5s). There should be no issues causing images to load incorrectly, or causing incorrect pages to be loaded for the given numbers.

This application should function effectively in any modern browser that supports javascript. The only restriction should come from memory available on the end-device, which will determine how much data the cache can store, and thus how quickly the application can reload previously visited pages

The only hard restriction is the support of Javascript version 18 or greater, as we use node's built-in fetch, which was only added in that version.

## What this application does and does not do

### It does

This application covers all of the core functionality mentioned above, and also includes caching and prefetching to speed up time-to-first-page (TTFP).

### It does not

To prioritize execution velocity, I have deferred the following items until the next development milestone:

1. Unit testing

While concerns are separated and helper functions liberally used to allow easy addition of unit tests, this MVP does not have them.

2. Explicit speed metrics
3. Robust security and secret management

An ideal product would not use a presigned S3 URL, as they have a max lifespan of one week. Instead, an IAM user should be created, and the credentials used in the backend, so that access can be provided indefinitely. This has the added bonus of increasing visibility into access rights, and allowing the eventual scoping of different users to different S3 buckets and/or folders.

Additionally, these secrets should be properly managed in a .env file, with credentials supplied by the user's corresponding AWS account, rather than being a constant that is manually entered by the user.

4. Greater API flexibility

See the API documentation for details. The short version is that multiple files would be able to be accessed (and chosen between), and their metadata would be fetched dynamically and displayed to the user on initial app load.

### Reasoning

This is a proof of concept demonstrating the ability for a user to quickly and conveniently access a pdf file through their browser without unnecessary slowdowns. The components excluded from development are not necessary for demonstrating that core functionality. The only mild exception to this is precise measurement of TTFP, which is an important metric. However, since this is an MVP with the goal of user feedback, I consider the "feel" of speed to be sufficient measurement, given time constraints on development.

Additionally, this application is developed such that all of the features enumerated above will be easy to add on.
