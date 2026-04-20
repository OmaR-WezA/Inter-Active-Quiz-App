"use client"

import { motion } from "framer-motion"
import { Gamepad2, ArrowLeft, Swords, Box, Play } from "lucide-react"

interface GamesHubPageProps {
    onBackHome: () => void
    onSelectGame: (gameId: "game" | "tic-tac-toe") => void
}

export default function GamesHubPage({ onBackHome, onSelectGame }: GamesHubPageProps) {
    return (
        <div className="min-h-screen px-4 py-8 pb-20 text-right flex flex-col items-center justify-center" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBackHome} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors bg-slate-800/50 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl">
                        رجوع
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Gamepad2 className="w-12 h-12 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tight">التحديات والألعاب الممتعة</h1>
                    <p className="text-slate-400 text-lg">العب، تحدى، واصنع متعتك واربح جوائز وهدايا سرية للمتميزين!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto relative z-10">

                    {/* Memory Game Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 rounded-3xl p-8 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                        onClick={() => onSelectGame("game")}
                    >
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                            <Box className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">الذاكرة البرمجية</h2>
                        <p className="text-slate-400 mb-8 px-4 leading-relaxed">
                            اختبر قوة وميض ذاكرتك! طابق الـ 16 بطاقة المقلوبة في أقل من 45 ثانية واربح الهدايا.
                        </p>
                        <button className="w-full bg-slate-700 group-hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                            العب الآن <Play className="w-4 h-4" />
                        </button>
                    </motion.div>

                    {/* Tic Tac Toe Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-800/60 border border-slate-700 hover:border-purple-500/50 rounded-3xl p-8 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-purple-500/10 cursor-pointer group"
                        onClick={() => onSelectGame("tic-tac-toe")}
                    >
                        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <Swords className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">تحدي X O (مستحيل)</h2>
                        <p className="text-slate-400 mb-8 px-4 leading-relaxed">
                            تحدى الكود والذكاء الاصطناعي (AI) في لعبة إكس أو الكلاسيكية. هل تملك التكتيك الكافي لهزائمه؟
                        </p>
                        <button className="w-full bg-slate-700 group-hover:bg-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                            تحدى الـ AI <Play className="w-4 h-4" />
                        </button>
                    </motion.div>



                </div>
            </motion.div>
        </div>
    )
}
