import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const resultId = searchParams.get('resultId')

        if (!resultId) {
            return Response.json({ error: 'Missing resultId' }, { status: 400 })
        }

        const { error } = await supabase
            .from('exam_results')
            .delete()
            .eq('id', resultId)

        if (error) {
            return Response.json({ error: 'فشل في حذف النتيجة', details: error.message }, { status: 500 })
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error('Delete result error:', error)
        return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
    }
}
