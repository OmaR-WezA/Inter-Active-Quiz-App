import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const resultId = searchParams.get('resultId')
        const { score, total_possible } = await request.json()

        if (!resultId) {
            return Response.json({ error: 'Missing resultId' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('exam_results')
            .update({
                score: parseInt(score),
                total_possible: parseInt(total_possible),
                status: 'completed' // Ensure it's marked as completed if edited
            })
            .eq('id', resultId)
            .select()

        if (error) {
            console.error('Error updating result:', error)
            return Response.json({ error: 'فشل في تعديل الدرجة', details: error.message }, { status: 500 })
        }

        return Response.json({ success: true, updated: data })
    } catch (error) {
        console.error('Update result error:', error)
        return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
    }
}
