import { supabase } from '@/lib/supabase'
import { PDFDocument, rgb, degrees } from 'pdf-lib'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return Response.json({ error: 'No fileId provided' }, { status: 400 })
    }

    // 1. Fetch metadata from Database to get storage path
    const { data: fileEntry, error: dbError } = await supabase
      .from('pdfs')
      .select('storage_path, name')
      .eq('id', fileId)
      .single()

    if (dbError || !fileEntry || !fileEntry.storage_path) {
      console.error('Database fetch error:', dbError)
      return Response.json({ error: 'File not found in database' }, { status: 404 })
    }

    // 2. Fetch file content from Supabase Storage
    const { data: storageBlob, error: storageError } = await supabase.storage
      .from('materials')
      .download(fileEntry.storage_path)

    if (storageError || !storageBlob) {
      console.error('Storage download error:', storageError)
      return Response.json({ error: 'Failed to download from storage' }, { status: 500 })
    }

    // 3. Convert Blob/Stream to ArrayBuffer
    const arrayBuffer = await storageBlob.arrayBuffer()
    const pdfBuffer = Buffer.from(arrayBuffer)

    // 4. Apply Watermarking (Using existing logic)
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pages = pdfDoc.getPages()

    for (const page of pages) {
      const { width, height } = page.getSize()

      // --- Repeated Background Watermark ---
      const stepX = 280
      const stepY = 220
      for (let x = -width; x < width * 2; x += stepX) {
        for (let y = -height; y < height * 2; y += stepY) {
          page.drawText('WEZA PRODUCTION', {
            x,
            y,
            size: 38,
            color: rgb(0.75, 0.75, 0.75),
            opacity: 0.08,
            rotate: degrees(35),
          })
        }
      }

      // --- Main Center Watermark ---
      const mainFontSize = Math.min(width, height) * 0.13
      page.drawText('WEZA PRODUCTION', {
        x: width / 2 - mainFontSize * 2.2,
        y: height / 2,
        size: mainFontSize,
        color: rgb(0.6, 0.6, 0.6),
        opacity: 0.15,
        rotate: degrees(35),
      })

      // --- Footer ---
      page.drawText('© Weza Production – All Rights Reserved', {
        x: width / 2 - 140,
        y: 18,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 0.7,
      })
    }

    const watermarkedPdf = await pdfDoc.save()

    return new Response(watermarkedPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileEntry.name)}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return Response.json({ error: 'فشل تحميل الملف وتعديله', details: String(error) }, { status: 500 })
  }
}
