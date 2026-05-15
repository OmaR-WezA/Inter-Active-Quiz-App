import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching feedback:', error)
            return Response.json({ error: 'فشل في تحميل التعليقات', details: error.message }, { status: 500 })
        }

        return Response.json({ feedbacks: data || [] })
    } catch (error) {
        console.error('Feedback API error:', error)
        return Response.json({ error: 'خطأ غير متوقع', details: String(error) }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return Response.json({ error: 'Missing ID' }, { status: 400 })

        const { error } = await supabase.from('feedback').delete().eq('id', id)
        if (error) throw error

        return Response.json({ success: true })
    } catch (error) {
        return Response.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
