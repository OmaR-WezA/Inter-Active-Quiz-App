import { unlinkSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    console.log('[DELETE] fileId:', fileId)

    if (!fileId) {
      return Response.json(
        { error: 'No fileId provided' },
        { status: 400 }
      )
    }

    const filesListPath = join(process.cwd(), 'public', 'pdfs-list.json')

    // Read list
    let filesList = []
    try {
      const data = readFileSync(filesListPath, 'utf-8')
      filesList = JSON.parse(data)
    } catch (err) {
      console.error('[DELETE] Error reading list:', err)
      return Response.json(
        { error: 'Files list not found' },
        { status: 404 }
      )
    }

    const fileEntry = filesList.find((f: any) => f.id === fileId)

    if (!fileEntry) {
      console.error('[DELETE] File entry not found:', fileId)
      return Response.json(
        { error: 'File not found in list' },
        { status: 404 }
      )
    }

    const filepath = join(process.cwd(), 'public', 'pdfs', fileEntry.savedName)
    console.log('[DELETE] File path:', filepath)

    // Delete file if exists
    if (existsSync(filepath)) {
      try {
        unlinkSync(filepath)
        console.log('[DELETE] Deleted from filesystem:', filepath)
      } catch (err) {
        console.error('[DELETE] Error deleting file:', err)
        return Response.json(
          { error: 'Failed to delete file from disk', details: String(err) },
          { status: 500 }
        )
      }
    } else {
      console.warn('[DELETE] File not found on disk (skip delete):', filepath)
    }

    // Remove from list
    const updatedList = filesList.filter((f: any) => f.id !== fileId)
    writeFileSync(filesListPath, JSON.stringify(updatedList, null, 2))

    console.log('[DELETE] File removed from list')
    return Response.json({ success: true })

  } catch (error) {
    console.error('[DELETE] Error:', error)
    return Response.json(
      { error: 'Failed to delete file', details: String(error) },
      { status: 500 }
    )
  }
}
