import express from 'express';
import cors from 'cors';
// import { fetch } from 'node-fetch';

import { PRESIGNED_S3_URL } from './url';

const app = express()

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.get('/documents', async (req, res) => {
  res.json({message: 'Wow good job'})
  // const data = await fetchData()
  // res.send(data)
})


const fetchData = async () => {
  const s3_response = await fetch(PRESIGNED_S3_URL, {
    method: 'GET'
  })
  console.log('HERE')
  //const { data, errors } = await s3_response.json()
  const text = await s3_response.text()
  console.log(s3_response.headers.get('content-type'))
  console.log(text);
  // const r = await s3_response;
  // console.log(r)
  // const { data, errors } = r.json()
	 if (s3_response.ok) {
     // console.log(data)
     return text
	 } else {
     // console.log('uh oh')
	 	// handle the graphql errors
	 	// const error = new Error(
	 	// 	errors?.map((e: any) => e.message).join('\n') ?? 'unknown',
	 	// )
	 	return Promise.reject('lol')
	 }
}

app.listen(8080)