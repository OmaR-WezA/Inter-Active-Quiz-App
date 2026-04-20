"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Gift, Circle, X as XIcon, RefreshCcw, Swords } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TicTacToePageProps {
    onBackHome: () => void
    onWinAction: () => void
}

type Player = "X" | "O" | null
type GameState = "selecting" | "playing" | "finished" | "tie"

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
]

export default function TicTacToePage({ onBackHome, onWinAction }: TicTacToePageProps) {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
    const [userPlayer, setUserPlayer] = useState<Player>("X")
    const [aiPlayer, setAiPlayer] = useState<Player>("O")
    const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
    const [gameState, setGameState] = useState<GameState>("selecting")
    const [winner, setWinner] = useState<Player>(null)
    const [isAiThinking, setIsAiThinking] = useState(false)
    const [isConcluding, setIsConcluding] = useState(false)
    const [winningLine, setWinningLine] = useState<number[] | null>(null)

    // -- Game Logic --
    const checkWinner = (squares: Player[]): Player => {
        for (const [a, b, c] of WINNING_COMBINATIONS) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]
            }
        }
        return null
    }

    const isBoardFull = (squares: Player[]): boolean => squares.every(square => square !== null)

    const startGame = (chosenPlayer: Player) => {
        setUserPlayer(chosenPlayer)
        setAiPlayer(chosenPlayer === "X" ? "O" : "X")
        setBoard(Array(9).fill(null))
        setCurrentPlayer("X") // X always starts
        setWinner(null)
        setIsConcluding(false)
        setWinningLine(null)
        setGameState("playing")
    }

    // Minimax Algorithm for unbeatable AI
    const minimax = (newBoard: Player[], player: Player, depth: number): number => {
        const minWin = checkWinner(newBoard)
        if (minWin === aiPlayer) return 10 - depth
        if (minWin === userPlayer) return depth - 10
        if (isBoardFull(newBoard)) return 0

        if (player === aiPlayer) {
            let bestScore = -Infinity
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = player
                    const score = minimax(newBoard, userPlayer!, depth + 1)
                    newBoard[i] = null
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = player
                    const score = minimax(newBoard, aiPlayer!, depth + 1)
                    newBoard[i] = null
                    bestScore = Math.min(score, bestScore)
                }
            }
            return bestScore
        }
    }

    const makeAiMove = () => {
        if (gameState !== "playing" || winner) return

        setIsAiThinking(true)

        // Simulate thinking delay so it's not instant
        setTimeout(() => {
            const newBoard = [...board]
            let move = -1

            // Special case: if it's the first move and the board is empty, pick a random edge/corner/center to avoid being deterministic
            const isBoardEmpty = newBoard.every(sq => sq === null)
            if (isBoardEmpty) {
                const openings = [0, 2, 4, 6, 8] // Corners and center
                move = openings[Math.floor(Math.random() * openings.length)]
            } else {
                let bestScore = -Infinity
                let moves: number[] = []

                for (let i = 0; i < 9; i++) {
                    if (!newBoard[i]) {
                        newBoard[i] = aiPlayer
                        const score = minimax(newBoard, userPlayer!, 0)
                        newBoard[i] = null

                        if (score > bestScore) {
                            bestScore = score
                            moves = [i]
                        } else if (score === bestScore) {
                            moves.push(i)
                        }
                    }
                }

                // Randomly pick one of the best moves
                if (moves.length > 0) {
                    move = moves[Math.floor(Math.random() * moves.length)]
                }
            }

            if (move !== -1) {
                newBoard[move] = aiPlayer
                setBoard(newBoard)

                const won = checkWinner(newBoard)
                if (won) {
                    setWinner(won)
                    const winCombo = WINNING_COMBINATIONS.find(c => newBoard[c[0]] && newBoard[c[0]] === newBoard[c[1]] && newBoard[c[0]] === newBoard[c[2]]) || null;
                    setWinningLine(winCombo)
                    setIsConcluding(true)
                    setTimeout(() => {
                        setGameState("finished")
                        setIsConcluding(false)
                    }, 4000)
                } else if (isBoardFull(newBoard)) {
                    setIsConcluding(true)
                    setTimeout(() => {
                        setGameState("tie")
                        setIsConcluding(false)
                    }, 4000)
                } else {
                    setCurrentPlayer(userPlayer)
                }
            }
            setIsAiThinking(false)
        }, 500)
    }

    // Effect to trigger AI move
    useEffect(() => {
        if (gameState === "playing" && currentPlayer === aiPlayer) {
            makeAiMove()
        }
    }, [currentPlayer, gameState])

    const handleCellClick = async (index: number) => {
        if (gameState !== "playing" || board[index] || currentPlayer !== userPlayer || isAiThinking || isConcluding) return

        const newBoard = [...board]
        newBoard[index] = userPlayer
        setBoard(newBoard)

        const won = checkWinner(newBoard)
        if (won) {
            setWinner(won)
            const winCombo = WINNING_COMBINATIONS.find(c => newBoard[c[0]] && newBoard[c[0]] === newBoard[c[1]] && newBoard[c[0]] === newBoard[c[2]]) || null;
            setWinningLine(winCombo)
            setIsConcluding(true)

            if (won === userPlayer) {
                const sId = localStorage.getItem("student_id")
                if (sId) {
                    await supabase.from("game_winners").insert({
                        student_id: sId,
                        game_name: "tic-tac-toe"
                    })
                }
            }

            setTimeout(() => {
                setGameState("finished")
                setIsConcluding(false)
            }, 4000)

        } else if (isBoardFull(newBoard)) {
            setIsConcluding(true)
            setTimeout(() => {
                setGameState("tie")
                setIsConcluding(false)
            }, 4000)
        } else {
            setCurrentPlayer(aiPlayer)
        }
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
                    <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                        <Swords className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400 font-bold">تحدي الذكاء الاصطناعي</span>
                    </div>
                </div>

                <div className="bg-slate-800/40 relative overflow-hidden backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl">

                    {gameState === "selecting" && (
                        <div className="text-center py-10">
                            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Swords className="w-12 h-12 text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-black text-white mb-4">تحدي لعبة إكس أو (X O)</h1>
                            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">اختر الرمز الذي تريده وتحدى الذكاء الاصطناعي المطور الذي لا يقهر بسهولة!</p>

                            <div className="flex justify-center gap-6">
                                <button onClick={() => startGame("X")} className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-500 rounded-3xl p-8 transition-all flex flex-col items-center w-40">
                                    <XIcon className="w-16 h-16 text-blue-400 mb-4" />
                                    <span className="text-white font-bold text-xl">العب كـ X</span>
                                    <span className="text-slate-500 text-sm mt-1">(يبدأ أولاً)</span>
                                </button>
                                <button onClick={() => startGame("O")} className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-red-400 rounded-3xl p-8 transition-all flex flex-col items-center w-40">
                                    <Circle className="w-16 h-16 text-red-500 mb-4" />
                                    <span className="text-white font-bold text-xl">العب كـ O</span>
                                    <span className="text-slate-500 text-sm mt-1">(يبدأ ثانياً)</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {gameState === "playing" && (
                        <div className="flex flex-col items-center">
                            <div className="flex justify-between w-full max-w-sm mb-8 bg-slate-900/80 rounded-2xl p-4 border border-slate-700">
                                <div className={`text-center px-4 py-2 flex flex-col items-center rounded-xl transition-all ${currentPlayer === userPlayer ? "bg-slate-800 border border-slate-600 ring-2 ring-cyan-500/50 shadow-lg" : "opacity-50"}`}>
                                    <span className="text-white font-bold mb-1">أنت ({userPlayer})</span>
                                    {userPlayer === "X" ? <XIcon className="w-6 h-6 text-blue-400" /> : <Circle className="w-6 h-6 text-red-500" />}
                                </div>

                                <div className="flex items-center text-slate-500 font-black text-xl">VS</div>

                                <div className={`text-center px-4 py-2 flex flex-col items-center rounded-xl transition-all ${currentPlayer === aiPlayer ? "bg-slate-800 border border-slate-600 ring-2 ring-purple-500/50 shadow-lg" : "opacity-50"}`}>
                                    <span className="text-white font-bold mb-1">الكمبيوتر ({aiPlayer})</span>
                                    {aiPlayer === "X" ? <XIcon className="w-6 h-6 text-blue-400" /> : <Circle className="w-6 h-6 text-red-500" />}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 bg-slate-700 p-3 rounded-2xl shadow-xl w-64 md:w-80 h-64 md:h-80 mx-auto relative">
                                {board.map((cell, idx) => (
                                    <button
                                        key={idx}
                                        disabled={gameState !== "playing" || cell !== null || (currentPlayer === aiPlayer) || isConcluding}
                                        onClick={() => handleCellClick(idx)}
                                        className={`rounded-xl flex items-center justify-center transition-all bg-slate-900
                               ${!cell && currentPlayer === userPlayer && !isConcluding ? 'hover:bg-slate-800 cursor-pointer' : ''}
                               ${cell ? 'cursor-default' : ''}
                               ${winningLine?.includes(idx) ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/30 ring-2 ring-amber-400 scale-[1.03] z-10 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : ''}
                               ${isConcluding && !winningLine?.includes(idx) ? 'opacity-30 grayscale' : ''}
                               `}
                                    >
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}>
                                            {cell === "X" && <XIcon className={`w-12 h-12 md:w-16 md:h-16 ${winningLine?.includes(idx) ? 'text-amber-400' : 'text-blue-400'} drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]`} />}
                                            {cell === "O" && <Circle className={`w-10 h-10 md:w-12 md:h-12 border-4 border-current rounded-full ${winningLine?.includes(idx) ? 'text-amber-400' : 'text-red-500'} drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]`} />}
                                        </motion.div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(gameState === "finished" || gameState === "tie") && (
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
                                {gameState === "finished" && winner === userPlayer ? "لقد حطمت المستحيل!" :
                                    gameState === "finished" && winner === aiPlayer ? "لقد هزمك الكمبيوتر!" : "النتيجة تعادل!"}
                            </h1>
                            <p className="text-slate-300 text-xl mx-auto mb-10 max-w-md">
                                {gameState === "finished" && winner === userPlayer
                                    ? "أنت عبقري حقيقي! تم تسجيل إنجازك العظيم رسمياً في قاعدة البيانات وسوف يتم تسليمك جائزة كبرى قريباً!"
                                    : "مستواك ممتاز وتقديراً لمجهودك في هذا التحدي الذهني الصعب، منحناك صندوق هدايا سري لتفتحه!"}
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

                            <button onClick={() => setGameState("selecting")} className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto justify-center">
                                <RefreshCcw className="w-4 h-4" />
                                أو العب مجدداً لانتقام رياضي
                            </button>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    )
}
