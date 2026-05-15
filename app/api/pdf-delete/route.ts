import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return Response.json({ error: 'Missing fileId' }, { status: 400 })
    }

    // 1. Get file metadata to find storage path
    const { data: fileEntry, error: fetchError } = await supabase
      .from('pdfs')
      .select('storage_path')
      .eq('id', fileId)
      .single()

    if (fetchError || !fileEntry) {
      return Response.json({ error: 'File record not found' }, { status: 404 })
    }

    // 2. Delete from Supabase Storage
    if (fileEntry.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([fileEntry.storage_path])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
      }
    }

    // 3. Delete from Supabase Database
    const { error: dbError } = await supabase
      .from('pdfs')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      return Response.json({ error: 'Failed to delete record', details: dbError.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return Response.json({ error: 'Failed to delete file', details: String(error) }, { status: 500 })
  }
}
