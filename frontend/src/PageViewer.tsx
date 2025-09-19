import React, { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

export const PageViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let renderTask: any = null
    let isCancelled = false

    const loadPage = async () => {
      const response = await fetch(`http://localhost:8000/documents?pageNum=${page}`)
      const pdfData = await response.arrayBuffer()

      const pdf = await getDocument({ data: pdfData }).promise
      const pdfPage = await pdf.getPage(1) // Each response is 1-page PDF

      const viewport = pdfPage.getViewport({ scale: 1.5 })
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = viewport.width
      canvas.height = viewport.height

      // Cancel previous render if it's still ongoing
      if (renderTask) {
        renderTask.cancel()
      }

      renderTask = pdfPage.render({
        canvasContext: context,
        viewport,
      })

      try {
        await renderTask.promise
      } catch (err) {
        if ((err as any).name === 'RenderingCancelledException') {
          console.log('Render cancelled')
        } else {
          console.error('Render error:', err)
        }
      }
    }

    loadPage()

    // Cleanup on unmount or re-run
    return () => {
      isCancelled = true
      if (renderTask) {
        renderTask.cancel()
      }
    }
  }, [page])

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc', marginBottom: '1rem' }} />
      <div>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>◀ Prev</button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next ▶</button>
      </div>
    </div>
  )
}
