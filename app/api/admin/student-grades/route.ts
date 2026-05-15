import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const studentId = searchParams.get('studentId')

        if (!studentId) {
            return Response.json({ error: 'Missing studentId' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('exam_results')
            .select('*')
            .eq('student_id', studentId)
            .order('completed_at', { ascending: false })

        if (error) {
            console.error('Error fetching grades:', error)
            return Response.json({ error: 'فشل في تحميل سجل الدرجات', details: error.message }, { status: 500 })
        }

        return Response.json({ grades: data || [] })
    } catch (error) {
        console.error('Grades API error:', error)
        return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
    }
}
