import React, { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'

// Use a hosted worker from the same version of pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

const PageViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:8000/documents?pageNum=${page}`)


        if (!response.ok) {
          const text = await response.text()
          console.error('Response Error:', text)
          throw new Error(`Failed to fetch page ${page}: ${text}`)
        }

        const pdfData = await response.arrayBuffer()
        const firstBytes = new Uint8Array(pdfData).slice(0, 10)
        console.log('First bytes:', firstBytes)
        const pdf = await getDocument({ data: pdfData }).promise
        const pdfPage = await pdf.getPage(1) // always page 1, since it's a 1-page PDF

        const viewport = pdfPage.getViewport({ scale: 2 }) // Increase scale for better resolution
        const canvas = canvasRef.current!
        const context = canvas.getContext('2d')!

        canvas.width = viewport.width
        canvas.height = viewport.height

        await pdfPage.render({ canvasContext: context, viewport }).promise
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [page])

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc', marginBottom: '1rem', maxWidth: '100%' }}
      />
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
          ◀ Prev
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={isLoading}>
          Next ▶
        </button>
      </div>
    </div>
  )
}

export default PageViewer
