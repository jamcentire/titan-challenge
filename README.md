## How to use this application

### Secrets

You should have received a presigned S3 url along with this challenge. Paste that into the `urls.ts` file as your S3_PRESIGNED_URL. This will allow you to access the S3 bucket containing the 100+ page pdf.

### Running the application

To run this application, open two terminal windows, navigating one to the frontend/ directory and one to backend/

In each directory, run npm install to install all necessary libraries

In backend/ run the following command to boot up the backend

npm run dev

In frontend/ run the following command to boot up the frontend

npm start

This should automatically open a browser window at localhost:3000, which comprises the app frontend. If it does not, navigate to that address in your browser to hit the app landing page

### Application functionality and navigation

As soon as you access the localhost 3000 address, the app will start up and fetch the sample pdf for viewing. You may use the arrows at the bottom to navigate across the pdf.

## AI usage

AI was used to generate the code templates for passing PDF files as data from the backend to the frontend, and the handling and state management for the frontend to receive and display the image files. It was also used to generate styling information for the frontend.