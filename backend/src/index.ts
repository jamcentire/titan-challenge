import express from 'express';
import cors from 'cors';
import { PDFDocument } from 'pdf-lib'
// import { fetch } from 'node-fetch';

import { FACTORIO_PRESIGNED_URL } from './urls';

const app = express()

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.get('/documents', async (req, res) => {
  // res.json({message: 'Wow good job'})
  // Backend - GET /documents?pageNum=N
  const pdfResponse = await fetch(FACTORIO_PRESIGNED_URL)
  const pdfBuffer = await pdfResponse.arrayBuffer()
  
  const fullPdf = await PDFDocument.load(pdfBuffer)
  const pageNum = parseInt(req.query.pageNum as string, 10)
  const newPdf = await PDFDocument.create()
  const [copiedPage] = await newPdf.copyPages(fullPdf, [pageNum - 1])
  newPdf.addPage(copiedPage)
  
  const pagePdfBytes = await newPdf.save()
  res.setHeader('Content-Type', 'application/pdf')
  res.send(Buffer.from(pagePdfBytes))

  // const data = await fetchData()
  // res.send(data)
})


// const fetchData = async () => {
//   const s3_response = await fetch(FACTORIO_PRESIGNED_URL, {
//     method: 'GET'
//   })
//   console.log('HERE')
//   //const { data, errors } = await s3_response.json()
//   const text = await s3_response.text()
//   console.log(s3_response.headers.get('content-type'))
//   console.log(text);
//   const js_text = JSON.parse(text)
//   console.log(js_text);
//   // const r = await s3_response;
//   // console.log(r)
//   // const { data, errors } = r.json()
// 	 if (s3_response.ok) {
//      // console.log(data)
//      return js_text
// 	 } else {
//      // console.log('uh oh')
// 	 	// handle the graphql errors
// 	 	// const error = new Error(
// 	 	// 	errors?.map((e: any) => e.message).join('\n') ?? 'unknown',
// 	 	// )
// 	 	return Promise.reject('lol')
// 	 }
// }

app.listen(8000)