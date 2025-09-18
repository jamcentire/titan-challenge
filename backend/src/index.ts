import express from 'express';
import cors from 'cors';
import { PDFDocument } from 'pdf-lib'
// import { fetch } from 'node-fetch';

import { FACTORIO_PRESIGNED_URL } from './urls';

const app = express()

app.use(cors({
  origin: 'http://localhost:3000'
}))

let cachedFullPdf: PDFDocument | null = null
let totalPages: number | null = null
let cachedPage1: Buffer | null = null

// Utility to extract a specific page from a PDFDocument as Buffer
async function extractPage(pdf: PDFDocument, pageNum: number): Promise<Buffer> {
  const newPdf = await PDFDocument.create()
  const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1])
  newPdf.addPage(copiedPage)
  const pageBytes = await newPdf.save()
  return Buffer.from(pageBytes)
}

// Load and cache the full PDF and page 1 at startup
async function preloadPdf() {
  try {
    console.log('[BOOT] Fetching PDF from S3...')
    const pdfResponse = await fetch(FACTORIO_PRESIGNED_URL)
    const pdfBuffer = await pdfResponse.arrayBuffer()

    cachedFullPdf = await PDFDocument.load(pdfBuffer)
    totalPages = cachedFullPdf.getPageCount()
    console.log(`[BOOT] PDF loaded (${totalPages} pages)`)

    // Immediately extract and cache page 1
    cachedPage1 = await extractPage(cachedFullPdf, 1)
    console.log('[BOOT] Page 1 extracted and cached')
  } catch (err) {
    console.error('[BOOT ERROR] Failed to preload PDF:', err)
  }
}

// Route to serve individual pages
app.get('/documents', async (req, res) => {
  const pageParam = req.query.pageNum
  const pageNum = parseInt(pageParam as string, 10)

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).send('Invalid page number')
  }

  try {
    if (!cachedFullPdf || !totalPages) {
      return res.status(503).send('PDF not yet loaded')
    }

    // Serve cached page 1
    if (pageNum === 1 && cachedPage1) {
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Cache-Control', 'public, max-age=60')
      return res.send(cachedPage1)
    }

    if (pageNum > totalPages) {
      return res.status(404).send('Page number exceeds total pages')
    }

    const pageBuffer = await extractPage(cachedFullPdf, pageNum)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Cache-Control', 'public, max-age=60')
    res.send(pageBuffer)
  } catch (err) {
    console.error('Error serving PDF page:', err)
    res.status(500).send('Error serving PDF page')
  }
})

// Boot logic
app.listen(8000, async () => {
  console.log('🚀 Server listening at http://localhost:8000')
  await preloadPdf()
})
