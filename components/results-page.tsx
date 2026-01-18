"use client"
import { motion } from "framer-motion"
import { Home, User } from "lucide-react"
import { storage } from "@/lib/storage"

interface Props {
  session: {
    username: string
    examType: "final" | "mcq" | "pythonAdvanced" | "pythonTopGrade"
  }
  onViewProfile: () => void
  onBackHome: () => void
}

export default function ResultsPage({ session, onViewProfile, onBackHome }: Props) {
  const user = storage.getUser(session.username)
  const lastExam = user?.exams[user.exams.length - 1]

  if (!lastExam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">خطأ في تحميل النتائج</p>
      </div>
    )
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "ممتاز", color: "text-green-400", bg: "bg-green-500/10" }
    if (percentage >= 80) return { grade: "جيد جداً", color: "text-blue-400", bg: "bg-blue-500/10" }
    if (percentage >= 70) return { grade: "جيد", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    if (percentage >= 60) return { grade: "مقبول", color: "text-orange-400", bg: "bg-orange-500/10" }
    return { grade: "يحتاج تحسين", color: "text-red-400", bg: "bg-red-500/10" }
  }

  const gradeInfo = getGrade(lastExam.percentage || 0)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Success Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-12 text-center mb-8">
          {/* Confetti animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-2">مبروك!</h1>
          <p className="text-slate-300 text-lg mb-8">تم إكمال الامتحان بنجاح</p>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${gradeInfo.bg} border border-slate-600 rounded-xl p-8 mb-8`}
          >
            <div className="text-5xl font-bold mb-2">
              <span className={gradeInfo.color}>{lastExam.score}</span>
              <span className="text-slate-400 text-3xl">/{lastExam.totalMarks}</span>
            </div>
            <p className="text-2xl font-semibold mb-2">
              <span className={gradeInfo.color}>{lastExam.percentage?.toFixed(1)}%</span>
            </p>
            <p className={`text-lg font-semibold ${gradeInfo.color}`}>{gradeInfo.grade}</p>
          </motion.div>

          {lastExam.mcqTotal !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-6">تفصيل النتائج</h3>
              <div className="space-y-3">
                {lastExam.mcqTotal !== undefined && (
                  <>
                    {/* MCQ Score */}
                    <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-300 font-medium">أسئلة الاختيار من متعدد (MCQ)</span>
                        <span className="text-cyan-400 font-bold text-base">
                          {lastExam.mcqCorrect}/{lastExam.mcqTotal}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full transition-all"
                          style={{ width: `${(lastExam.mcqCorrect! / lastExam.mcqTotal!) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400">
                        {Math.round((lastExam.mcqCorrect! / lastExam.mcqTotal!) * 100)}% - محسوبة من الدرجة النهائية
                      </p>
                    </div>

                    {/* Fill Blank Questions */}
                    <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-medium">أسئلة ملء الفراغات</span>
                        <span className="text-green-400 font-bold text-sm">محسوبة</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        الإجابات الصحيحة محسوبة من الدرجة النهائية
                      </p>
                    </div>

                    {/* Code Output Questions */}
                    <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-medium">أسئلة مخرجات الأكواد</span>
                        <span className="text-green-400 font-bold text-sm">محسوبة</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        الإجابات الصحيحة محسوبة من الدرجة النهائية
                      </p>
                    </div>

                    {/* Theory Questions */}
                    <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-medium">أسئلة نظرية</span>
                        <span className="text-amber-500 font-bold text-sm">بدون درجات</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        للتقييم الذاتي والفهم العميق
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              {
                label: "نوع الامتحان",
                value: session.examType === "final" ? "امتحان نهائي"
                  : session.examType === "mcq" ? "MCQ"
                    : session.examType === "pythonAdvanced" ? "Python Advanced"
                      : "Python Top Grade"
              },
              { label: "الوقت", value: new Date(lastExam.completedAt || "").toLocaleDateString("ar-EG") },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-slate-700/30 rounded-lg p-4"
              >
                <p className="text-slate-400 text-sm">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={onViewProfile}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all"
          >
            <User className="w-5 h-5" />
            عرض الملف الشخصي
          </motion.button>

          <motion.button
            onClick={onBackHome}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
