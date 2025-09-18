import React, { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

export const PageViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const loadPage = async () => {
      const response = await fetch(`http://localhost:3000/pdf-page?page=${page}`)
      const pdfData = await response.arrayBuffer()

      const pdf = await getDocument({ data: pdfData }).promise
      const pdfPage = await pdf.getPage(1) // always page 1 because it's a 1-page file

      const viewport = pdfPage.getViewport({ scale: 1.5 })
      const canvas = canvasRef.current!
      const context = canvas.getContext('2d')!

      canvas.height = viewport.height
      canvas.width = viewport.width

      await pdfPage.render({ canvasContext: context, viewport, canvas }).promise
    }

    loadPage()
  }, [page])

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc', marginBottom: '1rem' }} />
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>◀ Prev</button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next ▶</button>
      </div>
    </div>
  )
}

export default PageViewer
