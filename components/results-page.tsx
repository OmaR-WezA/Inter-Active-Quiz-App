"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Home, User, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ResultsPageProps {
  session: {
    username: string
  }
  resultId?: string | number
  onViewProfile: () => void
  onBackHome: () => void
}

export default function ResultsPage({ session, resultId, onViewProfile, onBackHome }: ResultsPageProps) {
  const [result, setResult] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const studentId = localStorage.getItem("student_id")
    if (!studentId && !resultId) {
      setLoading(false)
      return
    }

    try {
      // 1. Fetch result (either specific or latest)
      let query = supabase.from('exam_results').select('*')

      if (resultId) {
        query = query.eq('id', resultId)
      } else {
        query = query.eq('student_id', studentId).order('completed_at', { ascending: false }).limit(1)
      }

      const { data: resultData, error: resultError } = await query.single()

      if (resultError) throw resultError
      setResult(resultData)

      // 2. Fetch all questions for this exam to calculate breakdown
      const { data: questionsData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .eq('term', resultData.term)
        .eq('exam_name', resultData.exam_name)

      if (qError) throw qError
      setQuestions(questionsData)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatsBySection = () => {
    if (!result || !questions.length) return []
    const sections: Record<string, { correct: number, total: number, isGraded: boolean }> = {}

    questions.forEach(q => {
      const sectionName = q.section || "General"
      if (!sections[sectionName]) {
        sections[sectionName] = { correct: 0, total: 0, isGraded: q.type === 'mcq' }
      }

      sections[sectionName].total++
      const userAnswer = result.answers[q.id]

      // Smart correctness check
      let isCorrect = false
      if (userAnswer) {
        if (q.type === 'mcq') {
          isCorrect = userAnswer.toUpperCase() === q.correct_answer.toUpperCase()
        } else {
          isCorrect = userAnswer.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
        }
      }

      if (isCorrect) sections[sectionName].correct++
    })

    return Object.entries(sections).map(([name, stat]) => ({
      name,
      ...stat,
      percentage: (stat.correct / stat.total) * 100
    }))
  }

  const getDetailedBreakdown = () => {
    if (!result || !questions.length) return { mcq: { correct: 0, total: 0 }, other: { correct: 0, total: 0 } }

    let mcqCorrect = 0, mcqTotal = 0
    let otherCorrect = 0, otherTotal = 0

    questions.forEach(q => {
      const userAnswer = result.answers[q.id]
      const isCorrect = userAnswer && (
        q.type === 'mcq'
          ? userAnswer.toUpperCase() === q.correct_answer.toUpperCase()
          : userAnswer.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
      )

      if (q.type === 'mcq') {
        mcqTotal++
        if (isCorrect) mcqCorrect++
      } else {
        otherTotal++
        if (isCorrect) otherCorrect++
      }
    })

    return {
      mcq: { correct: mcqCorrect, total: mcqTotal },
      other: { correct: otherCorrect, total: otherTotal }
    }
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "ممتاز", color: "text-green-400", bg: "bg-green-500/10" }
    if (percentage >= 80) return { grade: "جيد جداً", color: "text-blue-400", bg: "bg-blue-500/10" }
    if (percentage >= 70) return { grade: "جيد", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    if (percentage >= 60) return { grade: "مقبول", color: "text-orange-400", bg: "bg-orange-500/10" }
    return { grade: "يحتاج تحسين", color: "text-red-400", bg: "bg-red-500/10" }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <p className="text-xl">جاري تحميل النتيجة...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-6">
        <p className="text-2xl text-slate-300">لم يتم العثور على نتائج حديثة.</p>
        <button onClick={onBackHome} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all">
          العودة للرئيسية
        </button>
      </div>
    )
  }

  const percentage = (result.score / result.total_possible) * 100
  const gradeInfo = getGrade(percentage)
  const sectionStats = getStatsBySection()
  const detailedStats = getDetailedBreakdown()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-right" dir="rtl"
      >
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 relative z-10"
          >
            <img
              src="/goose.png"
              alt="Result Icon"
              className="w-40 h-40 mx-auto object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-pulse"
            />
          </motion.div>

          <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            {result.exam_name}
          </p>
          <p className="text-slate-400 font-medium mb-10">الترم {result.term} - مراجعة شاملة</p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest text-right">الأسئلة الاختيارية</span>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-bold">GRADED</span>
              </div>
              <p className="text-4xl font-black text-cyan-400 text-right">{detailedStats.mcq.correct} <span className="text-slate-600 text-xl font-light">/ {detailedStats.mcq.total}</span></p>
            </div>
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest text-right">الأسئلة المقالية</span>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold">REVIEW</span>
              </div>
              <p className="text-4xl font-black text-amber-400 text-right">{detailedStats.other.correct} <span className="text-slate-600 text-xl font-light">/ {detailedStats.other.total}</span></p>
            </div>
          </div>

          {/* Main Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${gradeInfo.bg} border border-slate-600 rounded-2xl p-8 mb-8 relative group`}
          >
            <div className="text-6xl font-black mb-2 tracking-tighter">
              <span className={gradeInfo.color}>{result.score}</span>
              <span className="text-slate-500 text-3xl font-light">/{result.total_possible}</span>
            </div>
            <p className="text-3xl font-bold mb-2">
              <span className={gradeInfo.color}>{percentage.toFixed(1)}%</span>
            </p>
            <p className={`text-xl font-bold uppercase tracking-widest ${gradeInfo.color}`}>{gradeInfo.grade}</p>
          </motion.div>

          {/* Topic Performance List */}
          <div className="text-right mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1.5 bg-cyan-500 rounded-full" />
              <h3 className="text-2xl font-black text-white">تحليل الأداء حسب الفئة</h3>
            </div>

            <div className="grid gap-4">
              {sectionStats.map((stat, idx) => (
                <div key={idx} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <span className="text-slate-500 text-[10px] font-black block mb-1 uppercase tracking-[0.2em]">TOPIC</span>
                      <span className="text-white text-lg font-bold">{stat.name}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-cyan-400 font-black text-2xl block leading-none">{stat.percentage.toFixed(0)}%</span>
                      <span className="text-slate-500 text-[10px] font-bold mt-1 block tracking-wider">{stat.correct} / {stat.total} CORRECT</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)] bg-gradient-to-r ${stat.percentage >= 75 ? 'from-green-500 to-cyan-500' : stat.percentage >= 50 ? 'from-blue-500 to-cyan-500' : 'from-orange-500 to-amber-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-slate-400 text-sm">تاريخ الإكمال</p>
            <p className="text-white font-semibold">{new Date(result.completed_at).toLocaleDateString("ar-EG")}</p>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={onViewProfile}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 rounded-xl transition-all"
          >
            <User className="w-5 h-5" />
            عرض تفاصيل السجل
          </motion.button>
          <motion.button
            onClick={onBackHome}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
