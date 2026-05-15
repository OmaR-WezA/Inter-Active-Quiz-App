"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, BookMarked, User, Clock, FileText, ChevronRight, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Props {
  onSelect: (term: number, examName: string, correctionMode: "immediate" | "final") => void
  onBack: () => void
  onViewProfile: () => void
}

export default function ExamSelectionPage({ onSelect, onBack, onViewProfile }: Props) {
  const [selectedTerm, setSelectedTerm] = React.useState<number | null>(null)
  const [availableExams, setAvailableExams] = React.useState<string[]>([])
  const [selectedExam, setSelectedExam] = React.useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [correctionMode, setCorrectionMode] = React.useState<"immediate" | "final" | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (selectedTerm !== null) {
      fetchExams(selectedTerm)
      setSelectedCategory(null)
      setSelectedExam(null)
    }
  }, [selectedTerm])

  const fetchExams = async (term: number) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('exam_name')
        .eq('term', term)

      if (error) throw error

      // Get unique names
      const names = Array.from(new Set(data.map(q => q.exam_name)))
      setAvailableExams(names)
    } catch (err: any) {
      toast.error("فشل تحميل قائمة الاختبارات")
      console.error("Database Fetch Error Details:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (selectedTerm !== null && selectedExam && correctionMode) {
      const timer = setTimeout(() => {
        onSelect(selectedTerm, selectedExam, correctionMode)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [selectedTerm, selectedExam, correctionMode, onSelect])

  // More robust filtering for Arabic characters (haa/taa marbouta)
  const isPractical = (name: string) => {
    const n = name.toLowerCase()
    return n.includes('مراجعه العملي') ||
      n.includes('مراجعة العملي') ||
      n.includes('lecture revision activity')
  }

  const practicalExams = availableExams.filter(e => isPractical(e))
  const otherExams = availableExams.filter(e => !isPractical(e))

  const filteredExams = selectedTerm === 2
    ? (selectedCategory === 'practical' ? practicalExams : (selectedCategory === 'final' ? [] : (selectedCategory === null ? otherExams : availableExams)))
    : availableExams

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        {/* Top Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onViewProfile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-300 transition-all hover:border-cyan-500 hover:text-cyan-400"
          >
            <User className="w-5 h-5" />
            <span>الملف الشخصي</span>
          </motion.button>

          {selectedTerm !== null && (
            <motion.button
              onClick={() => {
                if (selectedExam !== null) setSelectedExam(null)
                else if (selectedCategory !== null) setSelectedCategory(null)
                else setSelectedTerm(null)
              }}
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              رجوع
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">اختر الاختبار</h1>
          <p className="text-slate-300 text-lg">راجع معلوماتك وتفوق في دراستك</p>
        </div>

        <AnimatePresence mode="wait">
          {selectedTerm === null ? (
            // Term Selection (Same as before)
            <motion.div
              key="term-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {[
                {
                  id: 2,
                  name: "الترم الثاني",
                  description: "حل نماذج اختباريه ومراجعات شاملة علي الترم الثاني في جميع المواد",
                  icon: <BookMarked className="w-12 h-12 text-cyan-400" />
                },
                {
                  id: 1,
                  name: "الترم الأول",
                  description: "مراجعة شاملة لأساسيات البرمجة بلغة Python",
                  icon: <BookMarked className="w-12 h-12 text-blue-400" />
                }

              ].map((term) => (
                <motion.button
                  key={term.id}
                  onClick={() => setSelectedTerm(term.id)}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br from-slate-800/50 to-slate-900 border-2 border-slate-700 hover:border-cyan-400 rounded-2xl p-8 text-left transition-all group relative overflow-hidden`}
                >
                  <div className="relative z-10 text-right">
                    <div className="flex justify-end mb-4">{term.icon}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">{term.name}</h2>
                    <p className="text-slate-300 mb-6">{term.description}</p>
                    <div className="flex items-center justify-end text-cyan-400 font-semibold gap-2">
                      اختر الترم <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </motion.div>
          ) : selectedExam === null ? (
            // Exam/Category Selection
            <motion.div
              key="exam-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory === 'practical' ? 'مراجعات العملي' : 'اختر الاختبار المتاح'}
                </h2>
                <button
                  onClick={() => selectedCategory ? setSelectedCategory(null) : setSelectedTerm(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {selectedCategory ? 'تغيير القسم' : 'تغيير الترم'}
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">جاري تحميل الاختبارات...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {/* Category Cards for Term 2 */}
                  {selectedTerm === 2 && selectedCategory === null && (
                    <>
                      {/* Practical Card */}
                      <motion.button
                        onClick={() => setSelectedCategory('practical')}
                        whileHover={{ scale: 1.02, x: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl p-6 text-right transition-all flex items-center justify-between group shadow-xl shadow-cyan-500/5"
                      >
                        <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-[-4px] transition-transform" />
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">مراجعات العملي</h3>
                            <p className="text-sm text-slate-400">جميع مراجعات البرمجة العملي لـ 80 سؤال</p>
                          </div>
                          <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <BookMarked className="w-6 h-6 text-cyan-400" />
                          </div>
                        </div>
                      </motion.button>

                      {/* Final Card (Empty) */}
                      <motion.button
                        onClick={() => setSelectedCategory('final')}
                        whileHover={{ scale: 1.02, x: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-slate-800/20 border border-slate-700/50 hover:border-blue-400/50 rounded-xl p-6 text-right transition-all flex items-center justify-between group opacity-70 hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">المراجعات النهائيه</h3>
                            <p className="text-sm text-slate-500">قريباً.. المراجعة النهائية الشاملة</p>
                          </div>
                          <div className="p-3 bg-blue-500/10 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-blue-400/50" />
                          </div>
                        </div>
                      </motion.button>

                      <div className="h-4" />
                      <div className="flex items-center gap-4 flex-row-reverse mb-2 px-2">
                        <div className="h-px bg-slate-700 flex-1" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">اختبارات الوحدات</span>
                        <div className="h-px bg-slate-700 flex-1" />
                      </div>
                    </>
                  )}

                  {/* List of Exams */}
                  {filteredExams.map((exam) => (
                    <motion.button
                      key={exam}
                      onClick={() => setSelectedExam(exam)}
                      whileHover={{ scale: 1.02, x: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-slate-800/40 border border-slate-700 hover:border-cyan-500 rounded-xl p-6 text-right transition-all flex items-center justify-between group"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{exam}</h3>
                          <p className="text-sm text-slate-400 italic">مراجعة شاملة للوحدة</p>
                        </div>
                        <div className="p-3 bg-cyan-500/10 rounded-lg">
                          <FileText className="w-6 h-6 text-cyan-400" />
                        </div>
                      </div>
                    </motion.button>
                  ))}

                  {filteredExams.length === 0 && selectedCategory === 'final' && (
                    <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                      <p className="text-slate-500 text-lg">لم يتم طرح المراجعات النهائية بعد..</p>
                      <p className="text-sm text-slate-600 mt-2">انتظرونا قريباً للحصول على أقوى مراجعة نهائية</p>
                    </div>
                  )}

                  {filteredExams.length === 0 && selectedCategory !== 'final' && (
                    <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                      <p className="text-slate-500">لا توجد اختبارات متاحة لهذا الترم حالياً</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            // Correction Mode Selection
            <motion.div
              key="mode-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <h2 className="text-2xl font-bold text-white">طريقة التصحيح</h2>
                <button onClick={() => setSelectedExam(null)} className="text-slate-400 hover:text-white transition-colors">تغيير الاختبار</button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    mode: "immediate" as const,
                    title: "التصحيح الفوري",
                    desc: "عرض الإجابة الصحيحة بعد كل سؤال مباشرة",
                    icon: <Clock className="w-6 h-6" />
                  },
                  {
                    mode: "final" as const,
                    title: "التصحيح النهائي",
                    desc: "عرض النتائج بعد انتهاء الامتحان كاملاً",
                    icon: <CheckCircle className="w-6 h-6" />
                  },
                ].map(({ mode, title, desc, icon }) => (
                  <motion.button
                    key={mode}
                    onClick={() => setCorrectionMode(mode)}
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-800/40 border border-slate-700 hover:border-cyan-400 rounded-xl p-6 text-right transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{title}</h3>
                          <p className="text-slate-300 text-sm">{desc}</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                          {icon}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
