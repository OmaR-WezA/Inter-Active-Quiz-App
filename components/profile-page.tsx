"use client"
import { motion } from "framer-motion"
import { TrendingUp, Award, Calendar, LogOut } from "lucide-react"
import { storage } from "@/lib/storage"
import { useState } from "react"

interface Props {
  username: string
  onBackHome: () => void
}

export default function ProfilePage({ username, onBackHome }: Props) {
  const user = storage.getUser(username)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">لم يتم العثور على بيانات المستخدم</p>
      </div>
    )
  }

  const completedExams = user.exams.filter((e) => e.status === "completed")

  const examStats = {
    total: user.exams.length,
    completed: completedExams.length,
    incomplete: user.exams.filter((e) => e.status === "incomplete").length,
    avgScore:
      completedExams.length > 0
        ? (completedExams.reduce((sum, e) => sum + (e.percentage || 0), 0) / completedExams.length).toFixed(1)
        : 0,
    bestScore: completedExams.length > 0 ? Math.max(...completedExams.map((e) => e.percentage || 0)) : 0,
    totalMcqCorrect: completedExams.reduce((sum, e) => sum + (e.mcqCorrect || 0), 0),
    totalMcqAttempted: completedExams.reduce((sum, e) => sum + (e.mcqTotal || 0), 0),
  }

  const handleLogout = () => {
    localStorage.removeItem("last_username")
    onBackHome()
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header with Logout */}
        <motion.div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={() => setLogoutConfirm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل خروج</span>
          </motion.button>
        </motion.div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-slate-400">انضم في {new Date(user.joinDate).toLocaleDateString("ar-EG")}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: "إجمالي", value: examStats.total },
            { icon: Award, label: "مكتملة", value: examStats.completed, color: "text-green-400" },
            { icon: Award, label: "غير مكتملة", value: examStats.incomplete, color: "text-yellow-400" },
            { icon: Award, label: "المتوسط", value: `${examStats.avgScore}%` },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
            >
              <stat.icon className="w-8 h-8 text-cyan-400 mb-3" />
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color ? stat.color : "text-white"}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {examStats.totalMcqAttempted > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">إحصائيات الأداء العام</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">إجمالي أسئلة MCQ الصحيحة</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {examStats.totalMcqCorrect} / {examStats.totalMcqAttempted}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {examStats.totalMcqAttempted > 0
                    ? ((examStats.totalMcqCorrect / examStats.totalMcqAttempted) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">أفضل درجة</p>
                <p className="text-3xl font-bold text-green-400">{examStats.bestScore.toFixed(0)}%</p>
                <p className="text-sm text-slate-400 mt-1">من إجمالي الامتحانات</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Exam History */}
        {user.exams.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">سجل الامتحانات</h2>
            <div className="space-y-4">
              {user.exams.map((exam, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  className={`rounded-lg p-4 flex items-center justify-between hover:bg-slate-700/50 transition-all ${
                    exam.status === "incomplete" ? "bg-yellow-500/10 border border-yellow-500/50" : "bg-slate-700/30"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{exam.examType === "final" ? "امتحان نهائي" : "MCQ"}</p>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(exam.startedAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {exam.status === "incomplete" && (
                      <p className="text-yellow-400 text-sm font-semibold">لم يكتمل - تم مغادرة الامتحان</p>
                    )}
                    {exam.status === "completed" && exam.mcqTotal !== undefined && (
                      <p className="text-cyan-400 text-sm">
                        {exam.mcqCorrect}/{exam.mcqTotal} MCQ صحيحة
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {exam.status === "completed" ? (
                      <>
                        <p className="text-2xl font-bold text-cyan-400">{exam.percentage?.toFixed(0)}%</p>
                        <p className="text-sm text-slate-400">
                          {exam.score}/{exam.totalMarks}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-yellow-400">قيد الانتظار</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">لم تكمل أي امتحانات بعد</p>
          </div>
        )}
      </motion.div>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setLogoutConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md"
          >
            <h3 className="text-2xl font-bold text-white mb-4">تسجيل الخروج</h3>
            <p className="text-slate-300 mb-6">هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
            <div className="flex gap-4">
              <motion.button
                onClick={() => setLogoutConfirm(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                إلغاء
              </motion.button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
              >
                تأكيد الخروج
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
