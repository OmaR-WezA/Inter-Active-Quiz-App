import { readFileSync } from 'fs'
import { join } from 'path'
import { PDFDocument, rgb, degrees } from 'pdf-lib'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    console.log('Download request for fileId:', fileId)

    if (!fileId) {
      return Response.json(
        { error: 'No fileId provided' },
        { status: 400 }
      )
    }

    // Read files list
    const filesListPath = join(process.cwd(), 'public', 'pdfs-list.json')
    let filesList: any[] = []

    try {
      const data = readFileSync(filesListPath, 'utf-8')
      filesList = JSON.parse(data)
    } catch (err) {
      console.error('Error reading files list:', err)
      return Response.json(
        { error: 'Files list not found' },
        { status: 404 }
      )
    }

    const fileEntry = filesList.find((f) => f.id === fileId)

    if (!fileEntry) {
      return Response.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read PDF
    const filepath = join(
      process.cwd(),
      'public',
      'pdfs',
      fileEntry.savedName
    )

    let pdfBuffer: Buffer
    try {
      pdfBuffer = readFileSync(filepath)
    } catch (err) {
      return Response.json(
        { error: 'PDF file not found' },
        { status: 404 }
      )
    }

    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pages = pdfDoc.getPages()

    console.log('Adding watermark to', pages.length, 'pages')

    for (const page of pages) {
      const { width, height } = page.getSize()

      // =========================
      // 🔥 PREMIUM WATERMARK (Repeated)
      // =========================
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

      // =========================
      // ⭐ MAIN CENTER WATERMARK
      // =========================
      const mainFontSize = Math.min(width, height) * 0.13

      page.drawText('WEZA PRODUCTION', {
        x: width / 2 - mainFontSize * 2.2,
        y: height / 2,
        size: mainFontSize,
        color: rgb(0.6, 0.6, 0.6),
        opacity: 0.15,
        rotate: degrees(35),
      })

      // =========================
      // 🧾 FOOTER (حقوق)
      // =========================
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
        // مهم: اسم آمن بدون مشاكل encoding
        'Content-Disposition': `attachment; filename="document.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('ابلععع downlaod', error)
    return Response.json(
      { error: 'Failed to download file', details: String(error) },
      { status: 500 }
    )
  }
}
