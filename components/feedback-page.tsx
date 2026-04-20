"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Star, MessageSquare, Phone, User, CheckCircle2, Home, Loader2, Sparkles, ShieldCheck, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface FeedbackPageProps {
    onBack: () => void
}

export default function FeedbackPage({ onBack }: FeedbackPageProps) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [instructorRating, setInstructorRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const [goodThings, setGoodThings] = useState("")
    const [needsImprovement, setNeedsImprovement] = useState("")
    const [platformFeedback, setPlatformFeedback] = useState("")
    const [allowPublic, setAllowPublic] = useState(true)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const errorRef = useRef<HTMLDivElement>(null)

    const validateFeedback = (text: string) => {
        return text.trim().length >= 10
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!name.trim()) {
            handleError("برجاء إدخال اسمك")
            return
        }

        if (phone.length < 8 || !/^\d+$/.test(phone)) {
            handleError("ادخل رقم صحيح")
            return
        }

        if (!validateFeedback(goodThings)) {
            handleError("برجاء كتابة 10 حروف على الأقل في خانة (الأشياء الجيدة)")
            return
        }



        if (!validateFeedback(platformFeedback)) {
            handleError("برجاء كتابة اقتراحاتك للمنصة (10 حروف على الأقل)")
            return
        }

        if (instructorRating === 0) {
            handleError("برجاء تقييم تجربة الشرح بالنجوم في أسفل الصفحة")
            return
        }

        setIsSubmitting(true)

        try {
            const { error: dbError } = await supabase
                .from('feedback')
                .insert({
                    student_name: name,
                    phone_number: phone,
                    instructor_rating: instructorRating,
                    good_things: goodThings,
                    needs_improvement: needsImprovement,
                    platform_feedback: platformFeedback,
                    allow_public: allowPublic
                })

            if (dbError) throw dbError

            setIsSuccess(true)
        } catch (err) {
            console.error(err)
            handleError("حدث خطأ أثناء إرسال التقييم، يرجى المحاولة لاحقاً")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleError = (msg: string) => {
        setError(msg)
        setTimeout(() => {
            errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900/50">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-10 rounded-[3rem] max-w-lg w-full text-center shadow-2xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
                    >
                        <CheckCircle2 className="w-12 h-12" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-white mb-4">تم الإرسال!</h2>
                    <p className="text-slate-300 mb-10 leading-relaxed text-lg">
                        شكراً لوقتك وملاحظاتك. كل كلمة كتبتها سأهتم بها جداً.
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20"
                    >
                        <Home className="w-6 h-6" />
                        العودة للرئيسية
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-20" dir="rtl">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 max-w-3xl w-full relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />

                <div className="text-center mb-12 relative z-10">
                    <div className="inline-flex p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 mb-6 group">
                        <Sparkles className="w-10 h-10 text-cyan-400 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">تقييمك الشخصي</h1>
                    <p className="text-slate-400 text-sm sm:text-base">رأيك يساعدنا على التطوير المستمر</p>
                </div>

                {error && (
                    <motion.div
                        ref={errorRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl mb-10 text-sm font-bold flex items-center gap-4 shadow-lg shadow-red-500/5"
                    >
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 relative z-10">

                    {/* Identity Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-r-4 border-blue-500 pr-4">
                            <h2 className="text-2xl font-black text-white">البيانات الشخصية</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border-2 border-slate-700/50 text-white rounded-2xl py-5 pr-14 pl-5 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 font-bold"
                                    placeholder="الاسم الثلاثي"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                                    <Phone className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        if (val.length <= 11) setPhone(val)
                                    }}
                                    className="w-full bg-slate-900/50 border-2 border-slate-700/50 text-white rounded-2xl py-5 pr-14 pl-5 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 text-left font-bold"
                                    placeholder="رقم الهاتف"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Feedback Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-r-4 border-cyan-500 pr-4">
                            <h2 className="text-2xl font-black text-white">رأيك في الشرح والمحتوى</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-slate-200 font-bold block pr-2">أشياء نالت إعجابك:</label>
                                <textarea
                                    value={goodThings}
                                    onChange={(e) => setGoodThings(e.target.value)}
                                    className="w-full bg-slate-900/60 border-2 border-slate-700/50 text-white rounded-[1.5rem] p-6 focus:border-cyan-500 outline-none transition-all min-h-[160px] resize-none placeholder:text-slate-600 font-medium"
                                    placeholder="أكتب هنا ما الذى نال إعجابك وفادك فى الشرح..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-slate-200 font-bold block pr-2">أشياء تحتاج لتطوير:</label>
                                <textarea
                                    value={needsImprovement}
                                    onChange={(e) => setNeedsImprovement(e.target.value)}
                                    className="w-full bg-slate-900/60 border-2 border-slate-700/50 text-white rounded-[1.5rem] p-6 focus:border-cyan-500 outline-none transition-all min-h-[160px] resize-none placeholder:text-slate-600 font-medium"
                                    placeholder="أكتب لنا كيف يمكن أن نكون أفضل فى المرات القادمة..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Platform Suggestions */}
                    <section className="space-y-8 pt-8 border-t border-slate-700/50">
                        <div className="flex items-center gap-3 border-r-4 border-emerald-500 pr-4">
                            <h2 className="text-2xl font-black text-white">اقتراحات للمنصة</h2>
                        </div>
                        <textarea
                            value={platformFeedback}
                            onChange={(e) => setPlatformFeedback(e.target.value)}
                            className="w-full bg-slate-900/60 border-2 border-slate-700/50 text-white rounded-[1.5rem] p-6 focus:border-emerald-500 outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-600 font-medium"
                            placeholder="اكتب اقتراحاتك لتطوير المنصة تقنياً وكيف تظهر بشكل أفضل..."
                        />
                    </section>

                    {/* Rating Section - NOW AT BOTTOM */}
                    <section className="space-y-8 pt-8 border-t border-slate-700/50">
                        <div className="bg-slate-900/40 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-700/30 text-center shadow-xl">
                            <p className="text-slate-300 font-black mb-8 text-lg sm:text-xl">تقييمك العام للتجربة بالنجوم؟</p>
                            <div className="flex items-center justify-center gap-1 sm:gap-3" dir="ltr">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setInstructorRating(star)}
                                        className="p-2 transition-all hover:scale-125 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-9 h-9 sm:w-14 sm:h-14 ${star <= (hoverRating || instructorRating)
                                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                                                : "text-slate-700/50"
                                                } transition-all`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-[2.5rem] space-y-6">
                            <label className="flex items-start gap-5 cursor-pointer group">
                                <div className={`mt-1.5 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${allowPublic ? 'bg-cyan-500 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-110' : 'bg-slate-900 border-slate-600 group-hover:border-slate-500'}`}>
                                    {allowPublic && <CheckCircle2 className="w-5 h-5 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={allowPublic}
                                    onChange={(e) => setAllowPublic(e.target.checked)}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <p className="text-white font-black text-lg">أوافق على عرض هذا التقييم في صفحة التقييمات والأعمال</p>
                                    <div className="flex items-center gap-3 mt-3 text-emerald-400/80">
                                        <ShieldCheck className="w-5 h-5" />
                                        <p className="text-sm font-bold">بياناتك الشخصية وأرقامك في أمان تام ولن يتم الإفصاح عنها لأي جهة.</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="pt-6 flex gap-4 flex-col-reverse sm:flex-row">
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="w-full sm:w-1/3 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-2/3 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-2xl shadow-cyan-600/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <MessageSquare className="w-6 h-6" />
                                    إرسال التقييم النهائي
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
