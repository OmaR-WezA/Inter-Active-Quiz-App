import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query')

        // Fetch students with their completed results only for accurate stats
        let supabaseQuery = supabase
            .from('students')
            .select(`
        *,
        exam_results (
          score,
          total_possible,
          status
        )
      `)
            .order('created_at', { ascending: false })

        if (query) {
            supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,student_code.ilike.%${query}%`)
        }

        const { data, error } = await supabaseQuery

        if (error) {
            console.error('Error fetching students:', error)
            return Response.json({ error: 'فشل في تحميل قائمة الطلاب', details: error.message }, { status: 500 })
        }

        // Process stats: Count ONLY completed exams and sum up scores
        const formattedStudents = (data || []).map(student => {
            const completedExams = (student.exam_results || []).filter((r: any) => r.status === 'completed')

            const totalScore = completedExams.reduce((sum: number, r: any) => sum + (r.score || 0), 0)
            const totalPossible = completedExams.reduce((sum: number, r: any) => sum + (r.total_possible || 0), 0)

            // Count "Perfect" exams (where score equals total_possible)
            const perfectExamsCount = completedExams.filter((r: any) =>
                r.score !== null && r.score >= r.total_possible && r.total_possible > 0
            ).length

            return {
                ...student,
                examCount: completedExams.length,
                totalScore: totalScore,
                totalPossible: totalPossible,
                averagePercentage: totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0,
                perfectExamsCount: perfectExamsCount,
                exam_results: undefined
            }
        })

        return Response.json({ students: formattedStudents })
    } catch (error) {
        console.error('Students API error:', error)
        return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
    }
}
