import { join } from 'path'
import { readFileSync } from 'fs'

export async function GET() {
  try {
    const filesListPath = join(process.cwd(), 'public', 'pdfs-list.json')

    let filesList = []
    try {
      const data = readFileSync(filesListPath, 'utf-8')
      filesList = JSON.parse(data)
    } catch (err) {
      console.log('list not found or error:', err)
      filesList = []
    }

    console.log('جاي اهو', filesList)

    return Response.json({
      files: filesList,
    })
  } catch (error) {
    console.error('ابلععع list', error)
    return Response.json(
      { error: 'Failed to list files', details: String(error) },
      { status: 500 }
    )
  }
}
