### Database

The sample PDF exists in an S3 bucket in raw PDF form. The database comprises exactly one file, which is hardcoded into being used as our test data. The S3 bucket is designated public, and a presigned URL has been generated in order to allow user access and testing.

### Backend

The backend comprises a small server hosted locally at localhost:8000. It uses Express to simplify creation and handling of endpoints, and uses the built-in node fetch to fetch data from the S3 bucket using a presigned URL.

In order to provide a seamless user experience, the backend eagerly fetches the entire PDF on boot, and preparses page one, so that it may be immediately delivered to the frontend when the frontend is initialized.

This eager load also loads all of the PDF into local memory so that it can respond to future frontend requests immediately, without reloading data from the S3 bucket. This will hog memory, and should be adjusted at scale to prevent memory overrun, but I find this to be an acceptable tradeoff for a faster user experience (at least for an MVP).

The backend also uses cache control to prevent resending information already stored in the frontend's browser cache.

See the API documentation for details on its design and the tradeoffs entailed.

### Frontend

The frontend fetches one page at a time from our backend, automatically dsiplaying the first page of our sample PDF on load.

Current page number is stored as a state, and the desired page number is automatically fetched on page change.

Individual page data is awaited upon page navigation. Due to a combination of preloaded pages on the backend, and cache-control, this presents minimal lag in displaying pages.