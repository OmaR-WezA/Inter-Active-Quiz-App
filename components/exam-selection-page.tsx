"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, BookMarked } from "lucide-react"
import { examData } from "@/lib/exam-data"

interface Props {
  onSelect: (examType: "final" | "mcq" | "pythonAdvanced" | "pythonTopGrade", correctionMode: "immediate" | "final") => void
  onBack: () => void
}

export default function ExamSelectionPage({ onSelect, onBack }: Props) {
  const [selectedExam, setSelectedExam] = React.useState<"final" | "mcq" | "pythonAdvanced" | "pythonTopGrade" | null>(null)
  const [correctionMode, setCorrectionMode] = React.useState<"immediate" | "final" | null>(null)

  React.useEffect(() => {
    if (selectedExam && correctionMode) {
      const timer = setTimeout(() => {
        onSelect(selectedExam, correctionMode)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [selectedExam, correctionMode, onSelect])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 mb-12 transition-colors"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          رجوع
        </motion.button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">اختر الامتحان</h1>
          <p className="text-slate-300 text-lg">اختر نوع الامتحان الذي تريد حله</p>
        </div>

        {!selectedExam ? (
          // Exam Selection
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {Object.entries(examData).map(([key, exam]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedExam(key as "final" | "mcq" | "pythonAdvanced" | "pythonTopGrade")}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-cyan-400 rounded-2xl p-8 text-left transition-all group overflow-hidden"
              >
                <div className="relative z-10">
                  <BookMarked className="w-12 h-12 text-cyan-400 mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">{exam.name}</h2>
                  <p className="text-slate-300 mb-6">{exam.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Clock className="w-5 h-5 text-cyan-400" />
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="font-semibold text-cyan-400">{exam.questions.length}</span>
                      <span>سؤال</span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        ) : (
          // Correction Mode Selection
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">اختر طريقة التصحيح</h2>

            <div className="space-y-4">
              {[
                {
                  mode: "immediate" as const,
                  title: "التصحيح الفوري",
                  desc: "عرض الإجابة الصحيحة بعد كل سؤال مباشرة",
                },
                {
                  mode: "final" as const,
                  title: "التصحيح النهائي",
                  desc: "عرض النتائج والإجابات الصحيحة بعد انتهاء الامتحان كاملاً",
                },
              ].map(({ mode, title, desc }) => (
                <motion.button
                  key={mode}
                  onClick={() => setCorrectionMode(mode)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-cyan-400 rounded-xl p-6 text-left transition-all group"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-slate-300">{desc}</p>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => {
                setSelectedExam(null)
                setCorrectionMode(null)
              }}
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 mt-8 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              رجوع
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

import React from "react"
