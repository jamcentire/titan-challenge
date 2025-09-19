## Current API state

The API currently comprises only one enpoint: /documents

This endpoint accepts a query parameter pageNum that gives the specific page of the document to be fetched. The API does not currently support fetching more than one page at a time.

This design choice was made to improve caching, with the understanding that multiple-page fetches are largely unnecessary, as only one page is viewed at a time by the user (there are not even thumbnails), and prefetching should be limited to 3-4 pages in order to not overtax browser memory.

This improves caching by reusing exact http requests for each page, allowing the browser to efficiently return already sent information. If the document endpoint supported fetching multiple pages simultaneously, http caching would not return cached responses if, say, a user first sent a request for pages 2-4, and then requested pages 3-5. Because the request would look different, information would be resent even though there is significant overlap with information already held in the browser.

## Future improvements

In the future, this API should have more comprehensive functionality. Specifically, there should be another query parameter of document id added, leaving us with the following possible endpoint / query parameter combinations

/documents
/documents/{document_id}
/documents/{document_id}/pages/{page_number}

This breaks our architecture into 2 separate resources: documents and pages. Pages are a set of resource specific to each document, so this makes sense as an improved design for supporting multiple documents.

The /documents endpoint would support a GET that retrieves metadata for each document in the database. This metadata would be used on the frontend to present the user with a choice of document to load when they use the application.

/pages would allow users to specify a page to retrieve.