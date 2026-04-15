"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Award, Calendar, LogOut, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

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
      // Fetch student info
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()

      setStudent(studentData)

      // Fetch exams
      const { data: examData } = await supabase
        .from('exam_results')
        .select('*')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })

      setExams(examData || [])
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
    onBackHome()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <p className="text-xl">جاري تحميل الملف الشخصي...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>فشل تحميل بيانات المستخدم</p>
      </div>
    )
  }

  const completedExams = exams.filter(e => e.status === 'completed')

  const avgScore = completedExams.length > 0
    ? (completedExams.reduce((sum, e) => sum + (e.score / e.total_possible), 0) / completedExams.length * 100).toFixed(1)
    : 0

  const bestScore = completedExams.length > 0
    ? Math.max(...completedExams.map(e => (e.score / e.total_possible) * 100)).toFixed(0)
    : 0

  return (
    <div className="min-h-screen px-4 py-12 text-right" dir="rtl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBackHome} className="text-slate-300 hover:text-cyan-400 transition-colors">← العودة للاختيار</button>
          <button onClick={() => setLogoutConfirm(true)} className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>تسجيل خروج</span>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{student.full_name}</h1>
          <p className="text-slate-400">كود الطالب: {student.student_code}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
            <p className="text-slate-400 text-sm mb-1">إجمالي المحاولات</p>
            <p className="text-3xl font-bold text-white">{completedExams.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <Award className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-slate-400 text-sm mb-1">متوسط الدرجات</p>
            <p className="text-3xl font-bold text-green-400">{avgScore}%</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <Award className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="text-slate-400 text-sm mb-1">أفضل نتيجة</p>
            <p className="text-3xl font-bold text-yellow-400">{bestScore}%</p>
          </div>
        </div>

        {/* History */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">سجل المحاولات</h2>
          {exams.length > 0 ? (
            <div className="space-y-4">
              {exams.map((exam, idx) => {
                const perc = (exam.score / exam.total_possible) * 100
                return (
                  <div
                    key={idx}
                    onClick={() => exam.status === 'completed' ? onViewResult?.(exam.id) : onResume?.(exam)}
                    className={`bg-slate-700/30 rounded-lg p-4 flex items-center justify-between border-r-4 transition-all cursor-pointer ${exam.status === 'incomplete' ? 'border-yellow-500 hover:bg-yellow-500/10 shadow-lg shadow-yellow-500/5' : 'border-cyan-500 hover:bg-cyan-500/10'}`}
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {exam.exam_name}
                        {exam.status === 'incomplete' ? (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded ml-2 font-bold uppercase tracking-tight">قيد التقدم</span>
                        ) : (
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded ml-2 font-bold uppercase tracking-tight">تفاصيل</span>
                        )}
                      </p>
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(exam.completed_at).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <div className="text-left">
                      {exam.status === 'completed' ? (
                        <>
                          <p className="text-2xl font-bold text-cyan-400">{perc.toFixed(0)}%</p>
                          <p className="text-sm text-slate-400">{exam.score}/{exam.total_possible}</p>
                        </>
                      ) : (
                        <p className="text-yellow-400 font-medium pt-2">اضغط للمتابعة</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">لا يوجد سجل محاولات حالياً.</p>
          )}
        </div>
      </motion.div>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setLogoutConfirm(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">تسجيل الخروج</h3>
            <p className="text-slate-300 mb-6">هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
            <div className="flex gap-4">
              <button onClick={() => setLogoutConfirm(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-lg">إلغاء</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-red-600 text-white rounded-lg">تأكيد الخروج</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
