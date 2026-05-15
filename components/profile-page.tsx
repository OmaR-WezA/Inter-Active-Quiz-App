"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Award, Calendar, LogOut, Loader2, Sparkles, Target, Trophy } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProfilePageProps {
  username: string
  onBackHome: () => void
  onResume?: (exam: any) => void
  onViewResult?: (resultId: string | number) => void
}

export default function ProfilePage({ username, onBackHome, onResume, onViewResult }: ProfilePageProps) {
  const [student, setStudent] = useState<any>(null)
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [rankPoints, setRankPoints] = useState<number | null>(null)
  const [rankPercentage, setRankPercentage] = useState<number | null>(null)
  const [perfectExams, setPerfectExams] = useState(0)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    const studentId = localStorage.getItem("student_id")
    if (!studentId) {
      setLoading(false)
      return
    }

    try {
      // 1. Fetch student info
      const { data: studentData } = await supabase.from('students').select('*').eq('id', studentId).single()
      setStudent(studentData)

      // 2. Fetch student's exams
      const { data: examData } = await supabase.from('exam_results').select('*').eq('student_id', studentId).order('completed_at', { ascending: false })
      setExams(examData || [])

      // 3. Fetch all completed results to calculate global ranks
      const { data: allData } = await supabase.from('exam_results').select('score, total_possible, student_id, status').eq('status', 'completed')

      if (allData) {
        const studentMap = new Map<string, { score: number, possible: number, perfect: number }>()

        allData.forEach((r: any) => {
          if (!studentMap.has(r.student_id)) studentMap.set(r.student_id, { score: 0, possible: 0, perfect: 0 })
          const curr = studentMap.get(r.student_id)!
          curr.score += (r.score || 0)
          curr.possible += (r.total_possible || 0)
          if (r.score >= r.total_possible && r.total_possible > 0) curr.perfect += 1
        })

        const studentsList = Array.from(studentMap.entries()).map(([id, s]) => ({
          id,
          score: s.score,
          perfect: s.perfect,
          perc: s.possible > 0 ? (s.score / s.possible) * 100 : 0
        }))

        // Sort By Points (Default)
        const byPoints = [...studentsList].sort((a, b) => (b.perfect - a.perfect) || (b.score - a.score) || (b.perc - a.perc))
        const pRank = byPoints.findIndex(r => r.id === studentId)
        setRankPoints(pRank !== -1 ? pRank + 1 : null)

        // Sort By Percentage
        const byPerc = [...studentsList].sort((a, b) => (b.perc - a.perc) || (b.score - a.score))
        const prRank = byPerc.findIndex(r => r.id === studentId)
        setRankPercentage(prRank !== -1 ? prRank + 1 : null)

        // Set perfect exams for current student
        const me = studentsList.find(s => s.id === studentId)
        if (me) setPerfectExams(me.perfect)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("last_username")
    localStorage.removeItem("student_id")
    localStorage.removeItem("student_email")
    localStorage.removeItem("quiz_current_page")
    localStorage.removeItem("quiz_exam_session")
    onBackHome()
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
      <p className="text-xl">جاري تحميل ملفك الشخصي...</p>
    </div>
  )

  const completedExams = exams.filter(e => e.status === 'completed')
  const totalScore = completedExams.reduce((sum, e) => sum + (e.score || 0), 0)
  const totalPossible = completedExams.reduce((sum, e) => sum + (e.total_possible || 0), 0)
  const avgScore = totalPossible > 0 ? (totalScore / totalPossible * 100).toFixed(1) : "0"

  return (
    <div className="min-h-screen px-4 py-12 text-right" dir="rtl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBackHome} className="text-slate-300 hover:text-cyan-400 transition-colors">← العودة للرئيسية</button>
          <button onClick={() => setLogoutConfirm(true)} className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{student?.full_name}</h1>
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span className="bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50 font-mono">ID: {student?.student_code}</span>
            {perfectExams > 0 && <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20"><Sparkles className="w-3.5 h-3.5" /> {perfectExams} تميز </span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-1 bg-amber-500" />
            <Trophy className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-slate-400 text-xs mb-1">الترتيب بالنقاط</p>
            <p className="text-2xl font-black text-white">{rankPoints ? `#${rankPoints}` : "-"}</p>
            <p className="text-[10px] text-slate-500 mt-1">يعتمد على مجموع الدرجات</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-1 bg-cyan-500" />
            <Award className="w-6 h-6 text-cyan-500 mb-2" />
            <p className="text-slate-400 text-xs mb-1">الترتيب بالنسبة</p>
            <p className="text-2xl font-black text-white">{rankPercentage ? `#${rankPercentage}` : "-"}</p>
            <p className="text-[10px] text-slate-500 mt-1">يعتمد على دقة الإجابة</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-5">
            <Target className="w-6 h-6 text-emerald-500 mb-2" />
            <p className="text-slate-400 text-xs mb-1">إجمالي النقاط</p>
            <p className="text-2xl font-black text-white">{totalScore}</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-5">
            <TrendingUp className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-slate-400 text-xs mb-1">متوسط الدقة</p>
            <p className="text-2xl font-black text-white">{avgScore}%</p>
          </Card>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="text-cyan-400" /> سجل الاختبارات
          </h2>
          {exams.length > 0 ? (
            <div className="space-y-3">
              {exams.map((exam, idx) => {
                const perc = exam.total_possible > 0 ? (exam.score / exam.total_possible) * 100 : 0
                const isPerfect = exam.status === 'completed' && exam.score >= exam.total_possible && exam.total_possible > 0
                return (
                  <div
                    key={idx}
                    onClick={() => exam.status === 'completed' ? onViewResult?.(exam.id) : onResume?.(exam)}
                    className={`bg-slate-900/40 rounded-2xl p-4 flex items-center justify-between border-r-4 transition-all cursor-pointer hover:bg-slate-800/60 ${exam.status === 'incomplete' ? 'border-yellow-500' : 'border-slate-700'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{exam.exam_name}</p>
                        {isPerfect && <Sparkles className="w-3.5 h-3.5 text-yellow-500" />}
                        {exam.status === 'incomplete' && <Badge className="bg-yellow-500 text-slate-900 text-[9px] px-1.5 py-0 h-4">قيد الحل</Badge>}
                      </div>
                      <p className="text-[10px] text-slate-500">{new Date(exam.completed_at || exam.created_at).toLocaleDateString("ar-EG")}</p>
                    </div>
                    <div className="text-left font-black">
                      {exam.status === 'completed' ? (
                        <div className="flex flex-col items-end">
                          <span className={perc >= 90 ? "text-emerald-400" : perc >= 50 ? "text-cyan-400" : "text-red-400"}>{perc.toFixed(0)}%</span>
                          <span className="text-[10px] text-slate-500 font-normal">{exam.score} / {exam.total_possible}</span>
                        </div>
                      ) : <span className="text-yellow-500 text-xs border border-yellow-500/30 px-2 py-1 rounded-lg bg-yellow-500/5">استكمال</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : <p className="text-slate-500 text-center py-10">لا يوجد بيانات مسجلة بعد</p>}
        </div>
      </motion.div>

      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setLogoutConfirm(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><LogOut className="text-red-500 w-8 h-8" /></div>
            <h3 className="text-2xl font-black text-white mb-2">تسجيل الخروج</h3>
            <p className="text-slate-400 text-sm mb-8">هل أنت متأكد من رغبتك في مغادرة المنصة؟</p>
            <div className="flex gap-3">
              <Button onClick={() => setLogoutConfirm(false)} className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl">إلغاء</Button>
              <Button onClick={handleLogout} className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20">تأكيد</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
