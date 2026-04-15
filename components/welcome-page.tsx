"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, CheckCircle, FileText, User, Hash, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Props {
  onStart: (username: string) => void
  onOpenPDFLibrary?: () => void
}

export default function WelcomePage({ onStart, onOpenPDFLibrary }: Props) {
  const [studentCode, setStudentCode] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"code" | "confirm" | "register">("code")
  const [confirmedName, setConfirmedName] = useState("")

  const handleCheckCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentCode.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, full_name, email')
        .eq('student_code', studentCode.trim())
        .limit(1)

      if (error) {
        toast.error("حدث خطأ أثناء التحقق من الكود")
        console.error(error)
      } else if (data && data.length > 0) {
        const student = data[0]
        setConfirmedName(student.full_name)
        localStorage.setItem("student_id", student.id)
        localStorage.setItem("student_email", student.email || "")
        setStep("confirm")
      } else {
        // Code not found, move to registration
        setStep("register")
      }
    } catch (err) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      toast.error("يرجى إدخال الاسم الثلاثي")
      return
    }

    setLoading(true)
    try {
      const email = `${studentCode.trim()}@student.uza.com`

      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            full_name: fullName.trim(),
            student_code: studentCode.trim(),
            email: email
          }
        ])
        .select()
        .single()

      if (error) {
        toast.error("حدث خطأ أثناء التسجيل")
        console.error(error)
      } else if (data) {
        toast.success("تم التسجيل بنجاح!")
        localStorage.setItem("student_id", data.id)
        localStorage.setItem("student_name", fullName.trim())
        localStorage.setItem("student_email", email)
        onStart(fullName.trim())
      }
    } catch (err) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmLogin = () => {
    onStart(confirmedName)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-slate-900 -z-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      {/* PDF Library Button */}
      {onOpenPDFLibrary && (
        <motion.button
          onClick={onOpenPDFLibrary}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-6 right-6 flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400"
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">المكتبة</span>
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Logo Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
            className="inline-block p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/30 mb-6"
          >
            <BookOpen className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            C Programming Pro
          </h1>
          <p className="text-slate-400 text-lg font-medium">مراجعة مادة البرمجة بلغة C</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === "code" && (
              <motion.form
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCheckCode}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-lg font-bold text-slate-200">أدخل كود الطالب</label>
                    <Hash className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      placeholder="اكتب الكود هنا..."
                      className="w-full px-8 py-5 bg-slate-900/60 border-2 border-slate-700 rounded-2xl text-white text-xl text-center font-bold focus:border-blue-500 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-600"
                      autoFocus
                    />
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white text-xl font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Search className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <span>دخول</span>
                      <Search className="w-6 h-6" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-8"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/20">
                    <User className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-200">تم السجل بنجاح</h2>
                  <div className="py-6 px-4 bg-slate-900/40 border border-slate-700 rounded-2xl">
                    <p className="text-slate-400 mb-2">مرحباً بك مجدداً يا:</p>
                    <p className="text-3xl font-black text-blue-400 drop-shadow-sm">{confirmedName}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("code")}
                    className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all"
                  >
                    ليس أنا
                  </button>
                  <button
                    onClick={handleConfirmLogin}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    تأكيد وبدء
                  </button>
                </div>
              </motion.div>
            )}

            {step === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegister}
                className="space-y-8"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500/20">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">طالب جديد</h2>
                  <p className="text-slate-400 mt-2">الكود {studentCode} غير مسجل، يرجى كتابة اسمك.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-lg font-bold text-slate-200">الاسم الثلاثي</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد علي"
                    className="w-full px-8 py-5 bg-slate-900/60 border-2 border-slate-700 rounded-2xl text-white text-xl text-center focus:border-blue-500 focus:bg-slate-900 outline-none transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("code")}
                    className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all"
                  >
                    رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xl font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all font-semibold"
                  >
                    {loading ? "جاري التسجيل..." : "تسجيل ودخول"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Branding */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-xs font-bold tracking-[0.4em] uppercase">
            Developed by Weza Production
          </p>
        </div>
      </motion.div>
    </div>
  )
}
