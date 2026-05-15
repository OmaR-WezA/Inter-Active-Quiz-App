import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // 1. Fetch all students with completed results
        const { data, error } = await supabase
            .from('students')
            .select(`
        id,
        full_name,
        exam_results (
          score,
          total_possible,
          status
        )
      `)

        if (error) throw error

        // 2. Calculate stats with "Perfect Exams" preference
        const rankings = (data || []).map(student => {
            const completedExams = (student.exam_results || []).filter((r: any) => r.status === 'completed')

            const totalScore = completedExams.reduce((sum: number, r: any) => sum + (r.score || 0), 0)
            const totalPossible = completedExams.reduce((sum: number, r: any) => sum + (r.total_possible || 0), 0)

            // Count "Perfect" exams (score == total_possible)
            const perfectCount = completedExams.filter((r: any) =>
                r.score !== null && r.score >= r.total_possible && r.total_possible > 0
            ).length

            const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0

            return {
                id: student.id,
                name: student.full_name,
                totalScore,
                examCount: completedExams.length,
                perfectCount,
                percentage
            }
        })

        // 3. Apply the Fair Ranking Logic:
        // Priority: Perfect Exams Count -> Total Score -> Percentage -> Exam Count
        rankings.sort((a, b) => {
            if (b.perfectCount !== a.perfectCount) return b.perfectCount - a.perfectCount
            if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
            if (b.percentage !== a.percentage) return b.percentage - a.percentage
            return b.examCount - a.examCount
        })

        // Return top 20
        return Response.json({ rankings: rankings.slice(0, 20) })
    } catch (error) {
        console.error('Leaderboard API error:', error)
        return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }
}
