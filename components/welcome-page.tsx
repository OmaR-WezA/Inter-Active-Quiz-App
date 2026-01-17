"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle, Plus } from "lucide-react"
import { storage } from "@/lib/storage"

interface Props {
  onStart: (username: string) => void
}

export default function WelcomePage({ onStart }: Props) {
  const [name, setName] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [showExisting, setShowExisting] = useState(false)
  const [existingUsers, setExistingUsers] = useState<string[]>([])
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  useEffect(() => {
    const users = storage.getUserNames()
    setExistingUsers(users)
    if (users.length === 1) {
      setShowExisting(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      const existingUserNames = storage.getUserNames()
      const isNewUser = !existingUserNames.includes(name.trim())

      if (isNewUser) {
        setIsCreatingNew(true)
      } else {
        onStart(name.trim())
      }
    }
  }

  const handleSelectUser = (username: string) => {
    onStart(username)
  }

  const handleCreateAccount = () => {
    if (name.trim()) {
      onStart(name.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-4 rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-900" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Python Exam Pro
          </h1>
          <p className="text-xl text-slate-300">احترف البرمجة بلغة Python</p>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-10">
          {[
            { icon: "✓", text: "امتحانات تفاعلية شاملة" },
            { icon: "✓", text: "تصحيح فوري أو نهائي" },
            { icon: "✓", text: "تتبع تقدمك والنتائج" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-center gap-3 mb-4 last:mb-0"
            >
              <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-200">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {isCreatingNew ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">إنشاء حساب جديد</h2>
              <p className="text-slate-300">سيتم إنشاء ملف شخصي جديد باسم:</p>
              <p className="text-2xl font-bold text-cyan-400 mt-3">{name}</p>
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={() => {
                  setIsCreatingNew(false)
                  setName("")
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
              >
                رجوع
              </motion.button>
              <motion.button
                onClick={handleCreateAccount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all"
              >
                إنشاء الحساب
              </motion.button>
            </div>
          </motion.div>
        ) : showExisting && existingUsers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white text-center mb-4">أختر ملفك الشخصي</h2>

            <div className="space-y-3">
              {existingUsers.map((user, idx) => (
                <motion.button
                  key={user}
                  onClick={() => handleSelectUser(user)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-xl text-white font-semibold transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span>{user}</span>
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setShowExisting(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl p-3 text-slate-300 hover:text-white transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة حساب جديد</span>
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">أدخل اسمك</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد محمد"
                className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                autoFocus
              />
            </div>

            <motion.button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">ابدأ الآن</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            {existingUsers.length > 0 && (
              <motion.button
                type="button"
                onClick={() => setShowExisting(true)}
                whileHover={{ scale: 1.02 }}
                className="w-full text-slate-300 hover:text-cyan-400 font-semibold py-2 transition-all"
              >
                أو اختر من الحسابات الموجودة
              </motion.button>
            )}
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-slate-400 mt-8 text-sm">الإصدار 2.0 - جميع الحقوق محفوظة</p>
      </motion.div>
    </div>
  )
}
