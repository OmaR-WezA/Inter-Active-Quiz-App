import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const studentId = searchParams.get('studentId')

        if (!studentId) {
            return Response.json({ error: 'Missing studentId' }, { status: 400 })
        }

        // 1. Delete associated exam results first (if not handled by DB cascade)
        // Actually, in full_setup.sql, REFERENCES students(id) doesn't specify ON DELETE CASCADE.
        // So we should delete results manually.
        const { error: resultsError } = await supabase
            .from('exam_results')
            .delete()
            .eq('student_id', studentId)

        if (resultsError) {
            console.error('Error deleting student results:', resultsError)
        }

        // 2. Delete the student record
        const { error: studentError } = await supabase
            .from('students')
            .delete()
            .eq('id', studentId)

        if (studentError) {
            return Response.json({ error: 'فشل في حذف الطالب', details: studentError.message }, { status: 500 })
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error('Delete student error:', error)
        return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
    }
}
