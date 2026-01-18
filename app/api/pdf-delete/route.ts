import { unlinkSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    console.log(' Delete request for fileId:', fileId)

    if (!fileId) {
      return Response.json(
        { error: 'No fileId provided' },
        { status: 400 }
      )
    }

    // Get file from list
    const filesListPath = join(process.cwd(), 'public', 'pdfs-list.json')
    let filesList = []

    try {
      const data = readFileSync(filesListPath, 'utf-8')
      filesList = JSON.parse(data)
    } catch (err) {
      console.error('ابلععع Error reading files list:', err)
      return Response.json(
        { error: 'Files list not found' },
        { status: 404 }
      )
    }

    const fileEntry = filesList.find(
      (f: any) => f.id === fileId
    )

    if (!fileEntry) {
      console.error('ابلععع File entry not found for id:', fileId)
      return Response.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete file from filesystem
    const filepath = join(
      process.cwd(),
      'public',
      'pdfs',
      fileEntry.savedName
    )

    try {
      unlinkSync(filepath)
      console.log('File deleted from filesystem:', filepath)
    } catch (err) {
      console.error('ابلععع deleting file:', err)
    }

    // Remove from list
    filesList = filesList.filter(
      (f: any) => f.id !== fileId
    )
    writeFileSync(filesListPath, JSON.stringify(filesList, null, 2))

    console.log('File removed from list')

    return Response.json({
      success: true,
    })
  } catch (error) {
    console.error('ابلععع delete', error)
    return Response.json(
      { error: 'Failed to delete file', details: String(error) },
      { status: 500 }
    )
  }
}
