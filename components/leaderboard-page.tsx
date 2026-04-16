"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Medal, Star, Target, Crown, Award, ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface LeaderboardPageProps {
    onBackHome: () => void
    currentUsername?: string | null
}

interface StudentRank {
    id: string
    name: string
    percentage: number
    totalScore: number
    totalPossible: number
    examsTaken: number
}

export default function LeaderboardPage({ onBackHome, currentUsername }: LeaderboardPageProps) {
    const [rankings, setRankings] = useState<StudentRank[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('exam_results')
                .select(`
          score,
          total_possible,
          student_id,
          students ( full_name )
        `)
                .eq('status', 'completed')

            if (error) throw error

            if (data) {
                // Aggregate scores by student
                const studentMap = new Map<string, StudentRank>()

                data.forEach((result: any) => {
                    if (!result.students) return

                    const sId = result.student_id
                    const sName = result.students.full_name

                    if (!studentMap.has(sId)) {
                        studentMap.set(sId, { id: sId, name: sName, percentage: 0, totalScore: 0, totalPossible: 0, examsTaken: 0 })
                    }

                    const current = studentMap.get(sId)!
                    current.totalScore += result.score
                    current.totalPossible += result.total_possible
                    current.examsTaken += 1
                })

                const rankedArray = Array.from(studentMap.values()).map(s => {
                    s.percentage = s.totalPossible > 0 ? (s.totalScore / s.totalPossible) * 100 : 0
                    return s
                })

                // Sort descending by percentage
                rankedArray.sort((a, b) => b.percentage - a.percentage)

                setRankings(rankedArray.slice(0, 10))
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            case 1:
                return <Medal className="w-8 h-8 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" />
            case 2:
                return <Medal className="w-8 h-8 text-amber-700 drop-shadow-[0_0_15px_rgba(180,83,9,0.5)]" />
            default:
                return <span className="text-xl font-black text-slate-500 w-8 text-center">{index + 1}</span>
        }
    }

    return (
        <div className="min-h-screen px-4 py-8 text-right" dir="rtl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto">

                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBackHome} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors bg-slate-800/50 px-4 py-2 rounded-xl">
                        رجوع
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Header content */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6 relative">
                        <Trophy className="w-12 h-12 text-amber-400" />
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-2 border-dashed border-amber-400/30 rounded-full" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tight">لوحة الشرف للأبطال</h1>
                    <p className="text-slate-400 text-lg">أفضل 10 طلاب متفوقين في الاختبارات</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
                        <p className="text-slate-400 font-bold">جاري تحميل النتائج...</p>
                    </div>
                ) : rankings.length === 0 ? (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-12 text-center">
                        <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-xl font-bold">لا يوجد نتائج مسجلة حتى الآن.</p>
                        <p className="text-slate-500 mt-2">كن أنت الأول في القائمة!</p>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10">
                        <AnimatePresence>
                            {rankings.map((student, index) => {
                                const isCurrentUser = currentUsername === student.name

                                return (
                                    <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }}
                                        className={`relative p-5 rounded-[2rem] border overflow-hidden flex items-center justify-between gap-4 transition-all ${isCurrentUser
                                                ? "bg-gradient-to-l from-amber-500/20 to-amber-900/10 border-amber-500/50 shadow-lg shadow-amber-500/10 scale-[1.02]"
                                                : index < 3
                                                    ? "bg-slate-800/80 border-slate-700 hover:border-amber-500/30 shadow-xl"
                                                    : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800"
                                            }`}
                                    >
                                        {isCurrentUser && (
                                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
                                        )}

                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${index === 0 ? "bg-yellow-500/10" :
                                                    index === 1 ? "bg-slate-300/10" :
                                                        index === 2 ? "bg-amber-700/10" : "bg-slate-800"
                                                }`}>
                                                {getRankIcon(index)}
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`text-xl font-black mb-1 ${isCurrentUser ? "text-amber-400" : "text-white"}`}>{student.name}</h3>
                                                    {isCurrentUser && <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded font-bold">أنت</span>}
                                                </div>
                                                <p className="text-sm text-slate-400 flex items-center gap-2">
                                                    <Award className="w-4 h-4" />
                                                    {student.examsTaken} اختبارات مكتملة
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-left shrink-0 pl-2">
                                            <div className="bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-slate-700/50 shadow-inner">
                                                <p className="text-2xl font-black bg-gradient-to-br from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                                                    {student.percentage.toFixed(0)}%
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
