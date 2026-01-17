"use client"

import { motion } from "framer-motion"
import { Clock, Plus } from "lucide-react"

interface ResumeDialogProps {
  username: string
  examType: "final" | "mcq"
  onResume: () => void
  onNew: () => void
  onCancel: () => void
}

export default function ResumeDialog({ username, examType, onResume, onNew, onCancel }: ResumeDialogProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <Clock className="w-12 h-12 text-yellow-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">امتحان قيد الانتظار</h2>
            <p className="text-slate-300">لديك امتحان {examType === "final" ? "نهائي" : "MCQ"} لم يكتمل</p>
          </div>

          <p className="text-slate-300 text-center mb-8">هل تريد استئناف الامتحان من حيث توقفت أم بدء امتحان جديد؟</p>

          <div className="space-y-3">
            <motion.button
              onClick={onResume}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all"
            >
              <Clock className="w-5 h-5" />
              استئناف الامتحان
            </motion.button>

            <motion.button
              onClick={onNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              بدء امتحان جديد
            </motion.button>

            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-slate-300 hover:text-white font-semibold py-3 transition-all"
            >
              الرجوع للرئيسية
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
