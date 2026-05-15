import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching PDFs:', error)
      return Response.json({ error: 'فشل في تحميل قائمة الملفات', details: error.message }, { status: 500 })
    }

    // Map internal schema to frontend expected fields if necessary
    // Frontend expects: {id, filename, uploadedAt, size, term, category}
    // DB has: {id, name, created_at, size, term, category, url, storage_path}
    const formattedFiles = (data || []).map(f => ({
      id: f.id,
      filename: f.name,
      uploadedAt: f.created_at,
      size: f.size,
      term: String(f.term),
      category: f.category || 'general',
      url: f.url
    }))

    return Response.json({ files: formattedFiles })
  } catch (error) {
    console.error('Error in pdf-list API:', error)
    return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
  }
}
