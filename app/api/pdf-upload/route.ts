import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const UPLOAD_DIR = join(process.cwd(), 'public', 'pdfs')

    // Ensure upload directory exists
    try {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    } catch (err) {
      console.log('Directory already exists or error:', err)
    }

    // Generate unique filename
    const fileId = randomBytes(8).toString('hex')
    const filename = `${fileId}-${file.name}`
    const filepath = join(UPLOAD_DIR, filename)

    console.log('ارفع', filepath)

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Save file
    writeFileSync(filepath, buffer)

    // Save to database/storage (we'll use a JSON file for now)
    const filesListPath = join(process.cwd(), 'public', 'pdfs-list.json')
    let filesList = []

    try {
      const data = readFileSync(filesListPath, 'utf-8')
      filesList = JSON.parse(data)
    } catch {
      filesList = []
    }

    const newEntry = {
      id: fileId,
      filename: file.name,
      savedName: filename,
      uploadedAt: new Date().toISOString(),
    }

    filesList.push(newEntry)
    writeFileSync(filesListPath, JSON.stringify(filesList, null, 2))

    console.log('uploaded successfully:', fileId)

    return Response.json({
      success: true,
      fileId,
      filename: file.name,
    })
  } catch (error) {
    console.error('ابلععع list', error)
    return Response.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    )
  }
}
