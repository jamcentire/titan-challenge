import React, { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

export const PageViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [page, setPage] = useState(1)
  const [inputPage, setInputPage] = useState('')

  // 🔧 Hardcoded metadata
  const metadata = {
    totalPages: 121,
    sizeMB: 4.7,
    lastModified: '2025-09-18T15:06:00Z',
    name: 'Factorio: player\'s strategy guide'
  }

  useEffect(() => {
    let renderTask: any = null

    const loadPage = async () => {
      const response = await fetch(`http://localhost:8000/documents?pageNum=${page}`)
      if (!response.ok) {
        console.error(`Failed to load page ${page}`)
        return
      }

      const pdfData = await response.arrayBuffer()
      const pdf = await getDocument({ data: pdfData }).promise
      const pdfPage = await pdf.getPage(1) // The backend sends one-page PDFs

      const viewport = pdfPage.getViewport({ scale: 1.5 })
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = viewport.width
      canvas.height = viewport.height

      if (renderTask) renderTask.cancel()

      renderTask = pdfPage.render({ canvasContext: context, viewport })
      try {
        await renderTask.promise
      } catch (err) {
        if ((err as any).name !== 'RenderingCancelledException') {
          console.error('Render error:', err)
        }
      }
    }

    loadPage()

    return () => {
      if (renderTask) renderTask.cancel()
    }
  }, [page])

  const goToPage = () => {
    const num = parseInt(inputPage)
    if (isNaN(num) || num < 1 || num > metadata.totalPages) {
      alert('Invalid page number')
    } else {
      setPage(num)
      setInputPage('')
    }
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString(undefined, {
      dateStyle: 'long',
      timeStyle: 'short'
    })
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>{metadata.name}</h2>

      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc', marginBottom: '1rem' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>◀ Prev</button>
        <span style={{ margin: '0 1rem' }}>
          Page {page} / {metadata.totalPages}
        </span>
        <button onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))} disabled={page >= metadata.totalPages}>Next ▶</button>
        <button onClick={() => setPage(metadata.totalPages)} disabled={page >= metadata.totalPages}>Last</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          placeholder="Go to page..."
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          style={{ width: 100 }}
        />
        <button onClick={goToPage}>Go</button>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#555' }}>
        <div><strong>Total Pages:</strong> {metadata.totalPages}</div>
        <div><strong>File Size:</strong> {metadata.sizeMB} MB</div>
        <div><strong>Last Updated:</strong> {formatDate(metadata.lastModified)}</div>
      </div>
    </div>
  )
}

export default PageViewer
