import { supabase } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const termStr = formData.get('term') as string
    const category = formData.get('category') as string

    if (!file) {
      return Response.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    const term = parseInt(termStr) || 1
    const fileId = randomBytes(4).toString('hex')
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const storagePath = `${term}/${fileId}-${sanitizedName}`

    // 1. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('materials')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return Response.json({ error: 'خطأ في رفع الملف للسحابة', details: storageError.message }, { status: 500 })
    }

    // 2. Insert metadata into Supabase Table
    const { data: inserted, error: dbError } = await supabase
      .from('pdfs')
      .insert([
        {
          name: file.name,
          url: '', // Will update this in a second
          storage_path: storagePath,
          term: term,
          category: category || 'general',
          size: file.size
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      await supabase.storage.from('materials').remove([storagePath])
      return Response.json({ error: 'خطأ في حفظ بيانات الملف', details: dbError.message }, { status: 500 })
    }

    // 3. Update with the generated URL (using the DB record ID)
    if (inserted) {
      await supabase
        .from('pdfs')
        .update({ url: `/api/pdf-download?fileId=${inserted.id}` })
        .eq('id', inserted.id)
    }

    return Response.json({
      success: true,
      filename: file.name,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'فشل في رفع الملف', details: String(error) }, { status: 500 })
  }
}
