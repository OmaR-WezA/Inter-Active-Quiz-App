"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Medal, Star, Target, Crown, Award, ArrowLeft, Loader2, Sparkles } from "lucide-react"

interface LeaderboardPageProps {
    onBackHome: () => void
    currentUsername?: string | null
}

interface StudentRank {
    id: string
    name: string
    percentage: number
    totalScore: number
    perfectCount: number
    examCount: number
    rankPoints?: number
    rankPercentage?: number
}

export default function LeaderboardPage({ onBackHome, currentUsername }: LeaderboardPageProps) {
    const [rankings, setRankings] = useState<StudentRank[]>([])
    const [loading, setLoading] = useState(true)
    const [rankingSystem, setRankingSystem] = useState<'points' | 'percentage'>('points')

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/leaderboard')
            if (res.ok) {
                const data = await res.json()
                const rawRankings = data.rankings || []

                // Calculate both ranks for everyone
                const byPoints = [...rawRankings].sort((a, b) => (b.perfectCount - a.perfectCount) || (b.totalScore - a.totalScore) || (b.percentage - a.percentage))
                const byPercentage = [...rawRankings].sort((a, b) => (b.percentage - a.percentage) || (b.totalScore - a.totalScore))

                const fullyRanked = rawRankings.map((s: any) => ({
                    ...s,
                    rankPoints: byPoints.findIndex(r => r.id === s.id) + 1,
                    rankPercentage: byPercentage.findIndex(r => r.id === s.id) + 1
                }))

                setRankings(fullyRanked)
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const sortedRankings = useMemo(() => {
        return [...rankings].sort((a, b) => {
            if (rankingSystem === 'points') return (a.rankPoints || 0) - (b.rankPoints || 0)
            return (a.rankPercentage || 0) - (b.rankPercentage || 0)
        })
    }, [rankings, rankingSystem])

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            case 1:
                return <Medal className="w-8 h-8 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" />
            case 2:
                return <Medal className="w-8 h-8 text-amber-700 drop-shadow-[0_0_15px_rgba(180,83,9,0.5)]" />
            default:
                const rankValue = rankingSystem === 'points' ? sortedRankings[index]?.rankPoints : sortedRankings[index]?.rankPercentage
                return <span className="text-xl font-black text-slate-500 w-8 text-center">{rankValue}</span>
        }
    }

    return (
        <div className="min-h-screen px-4 py-8 text-right" dir="rtl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBackHome} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors bg-slate-800/50 px-4 py-2 rounded-xl">
                        رجوع
                        <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                        <button onClick={() => setRankingSystem('points')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${rankingSystem === 'points' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>بالنقاط</button>
                        <button onClick={() => setRankingSystem('percentage')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${rankingSystem === 'percentage' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>بالنسبة المئوية</button>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6 relative">
                        <Trophy className="w-12 h-12 text-amber-400" />
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-2 border-dashed border-amber-400/30 rounded-full" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tight">لوحة الشرف</h1>
                    <p className="text-slate-400 text-lg">
                        تصدّر القائمة {rankingSystem === 'points' ? 'بأعلى النقاط' : 'بأعلى دقة إجابة'}
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
                        <p className="text-slate-400 font-bold">جاري تحميل النتائج...</p>
                    </div>
                ) : sortedRankings.length === 0 ? (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-12 text-center">
                        <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-xl font-bold">لا يوجد نتائج مسجلة حتى الآن.</p>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10">
                        <AnimatePresence mode="wait">
                            {sortedRankings.map((student, index) => {
                                const isCurrentUser = currentUsername === student.name
                                const currentRank = rankingSystem === 'points' ? student.rankPoints : student.rankPercentage

                                return (
                                    <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
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
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${index === 0 && currentRank === 1 ? "bg-yellow-500/10" :
                                                index === 1 && currentRank === 2 ? "bg-slate-300/10" :
                                                    index === 2 && currentRank === 3 ? "bg-amber-700/10" : "bg-slate-800"
                                                }`}>
                                                {getRankIcon(index)}
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`text-xl font-black mb-1 ${isCurrentUser ? "text-amber-400" : "text-white"}`}>{student.name}</h3>
                                                    {isCurrentUser && <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded font-bold">أنت</span>}
                                                </div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <p className="text-sm text-slate-400 flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/30">
                                                        <Target className="w-3.5 h-3.5 text-red-500" />
                                                        {student.totalScore} نقطة
                                                    </p>
                                                    {student.perfectCount > 0 && (
                                                        <p className="text-sm text-yellow-400 flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                            {student.perfectCount} أوسمة تميز
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-left shrink-0 pl-2">
                                            <div className="bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-slate-700/50 shadow-inner">
                                                <p className="text-2xl font-black bg-gradient-to-br from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                                                    {Math.round(student.percentage)}%
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
