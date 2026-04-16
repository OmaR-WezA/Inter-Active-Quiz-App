"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Gift, Timer, RefreshCcw, ArrowLeft, Terminal, Database, Code, Shield, Cpu, Cloud, Smartphone, Globe } from "lucide-react"

interface MemoryGamePageProps {
    onBackHome: () => void
    onWinAction: () => void // e.g redirect to feedback
}

const CARDS = [
    { id: 1, icon: Terminal, color: "text-green-400", name: "terminal" },
    { id: 2, icon: Database, color: "text-blue-400", name: "database" },
    { id: 3, icon: Code, color: "text-amber-400", name: "code" },
    { id: 4, icon: Shield, color: "text-red-400", name: "shield" },
    { id: 5, icon: Cpu, color: "text-purple-400", name: "cpu" },
    { id: 6, icon: Cloud, color: "text-cyan-400", name: "cloud" },
    { id: 7, icon: Smartphone, color: "text-pink-400", name: "phone" },
    { id: 8, icon: Globe, color: "text-emerald-400", name: "globe" },
]

export default function MemoryGamePage({ onBackHome, onWinAction }: MemoryGamePageProps) {
    const [cards, setCards] = useState<any[]>([])
    const [flippedIndices, setFlippedIndices] = useState<number[]>([])
    const [matchedPairs, setMatchedPairs] = useState<string[]>([])
    const [timeLeft, setTimeLeft] = useState(45)
    const [isPlaying, setIsPlaying] = useState(false)
    const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "won" | "lost">("idle")

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false)
            setGameStatus("lost")
        }
        return () => clearInterval(timer)
    }, [isPlaying, timeLeft])

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [firstIndex, secondIndex] = flippedIndices
            const firstCard = cards[firstIndex]
            const secondCard = cards[secondIndex]

            if (firstCard.name === secondCard.name) {
                setMatchedPairs((prev) => [...prev, firstCard.name])
                setFlippedIndices([])
            } else {
                setTimeout(() => {
                    setFlippedIndices([])
                }, 1000)
            }
        }
    }, [flippedIndices, cards])

    useEffect(() => {
        if (matchedPairs.length === CARDS.length && cards.length > 0) {
            setIsPlaying(false)
            setGameStatus("won")
        }
    }, [matchedPairs, cards])

    const startGame = () => {
        // Shuffle cards
        const deck = [...CARDS, ...CARDS]
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, uniqueId: index }))

        setCards(deck)
        setFlippedIndices([])
        setMatchedPairs([])
        setTimeLeft(45)
        setGameStatus("playing")
        setIsPlaying(true)
    }

    const handleCardClick = (index: number) => {
        if (!isPlaying || flippedIndices.length >= 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].name)) {
            return
        }
        setFlippedIndices((prev) => [...prev, index])
    }

    return (
        <div className="min-h-screen px-4 py-8 pb-20 text-right flex flex-col items-center justify-center" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBackHome} className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors bg-slate-800/50 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl">
                        رجوع
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
                        <Gamepad2 className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-bold">العب واربح</span>
                    </div>
                </div>

                <div className="bg-slate-800/40 relative overflow-hidden backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl">

                    {gameStatus === "idle" && (
                        <div className="text-center py-10">
                            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <Gamepad2 className="w-12 h-12 text-blue-400" />
                            </div>
                            <h1 className="text-4xl font-black text-white mb-4">لعبة الذاكرة البرمجية</h1>
                            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">طابق جميع البطاقات في أقل من 45 ثانية لتفتح صندوق الهدايا السري!</p>

                            <div>
                                <button onClick={startGame} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:grayscale">
                                    ابدأ التحدي الآن!
                                </button>
                            </div>
                        </div>
                    )}

                    {gameStatus === "playing" && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
                                    <Timer className={`w-8 h-8 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
                                    <span className={`text-4xl font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                                        {timeLeft}
                                    </span>
                                </div>
                                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl px-6 py-4">
                                    <p className="text-slate-400 font-bold text-sm">المتطابق</p>
                                    <p className="text-2xl font-black text-white">{matchedPairs.length} / 8</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 sm:gap-4 perspective-1000">
                                <AnimatePresence>
                                    {cards.map((card, index) => {
                                        const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.name)
                                        return (
                                            <motion.div
                                                key={card.uniqueId}
                                                onClick={() => handleCardClick(index)}
                                                className="relative aspect-square cursor-pointer transform-style-3d"
                                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                                transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                {/* Front Side (Face down) */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-2xl flex items-center justify-center backface-hidden shadow-lg hover:border-cyan-400/50 transition-colors" style={{ backfaceVisibility: "hidden" }}>
                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-900/50 rounded-full flex items-center justify-center">
                                                        <span className="text-slate-500 font-bold">?</span>
                                                    </div>
                                                </div>

                                                {/* Back Side (Face up) */}
                                                <div className="absolute inset-0 bg-slate-900 border-2 border-cyan-500/50 rounded-2xl flex items-center justify-center backface-hidden shadow-[0_0_20px_rgba(6,182,212,0.2)]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                                                    <card.icon className={`w-8 h-8 sm:w-12 sm:h-12 ${matchedPairs.includes(card.name) ? 'text-slate-600' : card.color}`} />
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {(gameStatus === "won" || gameStatus === "lost") && (
                        <div className="text-center py-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ ease: "easeInOut", duration: 1.5 }}
                                className="w-32 h-32 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(251,191,36,0.3)] cursor-pointer hover:scale-110 transition-transform"
                                onClick={onWinAction}
                            >
                                <Gift className="w-16 h-16 text-white" />
                            </motion.div>
                            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-4 drop-shadow-sm">
                                {gameStatus === "won" ? "فزت بالتحدي!" : "انتهى الوقت!"}
                            </h1>
                            <p className="text-slate-300 text-xl mx-auto mb-10 max-w-md">
                                {gameStatus === "won"
                                    ? "أداؤك كان رائعاً وذاكرتك ممتازة! "
                                    : "لم يحالفك الحظ ومطابقة كافة البطاقات في الوقت المحدد"}
                            </p>

                            <motion.button
                                animate={{ y: [0, -5, 0] }}
                                transition={{ ease: "easeInOut", repeat: Infinity, duration: 2 }}
                                onClick={onWinAction}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-2xl px-12 py-6 rounded-2xl shadow-xl shadow-green-500/20 transition-all flex flex-col items-center justify-center gap-2 border border-green-400/30"
                            >
                                <span className="flex items-center gap-3">
                                    <Gift className="w-8 h-8" />
                                    تقييمك هيفرق
                                </span>
                            </motion.button>

                            {gameStatus === "lost" && (
                                <button onClick={startGame} className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto justify-center">
                                    <RefreshCcw className="w-4 h-4" />
                                    أو يمكنك لعب التحدي مرة أخرى من هنا
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
