"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Send, LogOut } from "lucide-react"
import { examData } from "@/lib/exam-data"
import { storage, type ExamResult } from "@/lib/storage"

interface ExamPageProps {
  session: {
    username: string
    examType: "final" | "mcq" | "pythonAdvanced" | "pythonTopGrade"
    correctionMode: "immediate" | "final"
    resumeData?: {
      currentQuestion: number
      answers: Record<number, string>
    }
  }
  onComplete: () => void
  onExit: () => void
}

export default function ExamPage({ session, onComplete, onExit }: ExamPageProps) {
  const exam = examData[session.examType]
  const [currentQuestion, setCurrentQuestion] = useState(session.resumeData?.currentQuestion || 0)
  const [answers, setAnswers] = useState<Record<number, string>>(session.resumeData?.answers || {})
  const [showFeedback, setShowFeedback] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showTheoryAnswer, setShowTheoryAnswer] = useState(false)
  const [mcqCorrectCount, setMcqCorrectCount] = useState(0)
  const [mcqCount, setMcqCount] = useState(0)

  const question = exam.questions[currentQuestion]
  const isLastQuestion = currentQuestion === exam.questions.length - 1
  const currentAnswer = answers[question.id]
  const hasAnsweredCurrentQuestion = currentAnswer !== undefined && currentAnswer !== ""
  const isCurrentQuestionAnswered = answeredQuestions.has(currentQuestion)

  useEffect(() => {
    storage.saveExamSession(session.username, session.examType, session.correctionMode, currentQuestion, answers)
  }, [currentQuestion, answers, session.username, session.examType, session.correctionMode])

  const handleAnswer = (answer: string) => {
    // In immediate mode, prevent editing after answering
    if (session.correctionMode === "immediate" && isCurrentQuestionAnswered) {
      return
    }

    setAnswers({ ...answers, [question.id]: answer })
  }

  const handleNext = () => {
    // For theory questions, require showing the answer first
    if (question.type === "theory" && !showTheoryAnswer) {
      return
    }

    if (!hasAnsweredCurrentQuestion) {
      return
    }

    // Mark question as answered only when moving to next
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]))

    // Show feedback in immediate mode after answering
    if (session.correctionMode === "immediate") {
      setShowFeedback(true)
    }

    // Theory questions don't require delay
    const isTheoryQuestion = question.type === "theory"
    const delay = isTheoryQuestion ? 0 : 2000

    if (isLastQuestion) {
      setTimeout(() => {
        completeExam()
      }, delay)
    } else {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setShowFeedback(false)
        setShowTheoryAnswer(false)
      }, delay)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowFeedback(false)
    }
  }

  const completeExam = () => {
    let scoredScore = 0
    let totalScoredMarks = 0
    let scorableCount = 0
    let correctCount = 0

    exam.questions.forEach((q) => {
      const userAnswer = answers[q.id]
      const correct = q.correct

      // Skip theory questions from scoring
      if (q.type === "theory") {
        return
      }

      totalScoredMarks += q.marks
      scorableCount++

      if (q.type === "mcq") {
        const answerIndex = userAnswer?.charCodeAt(0) - 65
        const correctIndex = correct.toUpperCase().charCodeAt(0) - 65
        if (answerIndex === correctIndex) {
          scoredScore += q.marks
          correctCount++
        }
      } else if (q.type === "fillblank" || q.type === "codeoutput") {
        // Exact match for fill blank and code output
        if (userAnswer?.toLowerCase().trim() === (correct as string).toLowerCase().trim()) {
          scoredScore += q.marks
          correctCount++
        }
      }
    })

    const result: ExamResult = {
      id: Date.now().toString(),
      examType: session.examType,
      correctionMode: session.correctionMode,
      score: scoredScore,
      totalMarks: totalScoredMarks,
      percentage: totalScoredMarks > 0 ? (scoredScore / totalScoredMarks) * 100 : 0,
      completedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      status: "completed",
      answers,
      mcqCorrect: correctCount,
      mcqTotal: scorableCount,
    }

    storage.saveExamResult(session.username, result)
    storage.clearCurrentSession(session.username)
    onComplete()
  }

  const isAnswerCorrect = () => {
    const userAnswer = answers[question.id]
    if (!userAnswer) return false

    if (question.type === "mcq") {
      const answerIndex = userAnswer.charCodeAt(0) - 65
      const correctIndex = question.correct.charCodeAt(0) - 65
      return answerIndex === correctIndex
    } else {
      return userAnswer.toLowerCase().trim() === (question.correct as string).toLowerCase().trim()
    }
  }

  useEffect(() => {
    let correctCount = 0
    let totalCount = 0

    exam.questions.forEach((q) => {
      if (q.type === "mcq") {
        totalCount++
        if (isAnswerCorrect()) {
          correctCount++
        }
      }
    })

    setMcqCorrectCount(correctCount)
    setMcqCount(totalCount)
  }, [exam.questions, answers])

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Header with Exit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">
                  السؤال {currentQuestion + 1} من {exam.questions.length}
                </span>
                <span className="text-sm text-slate-400">
                  {Math.round(((currentQuestion + 1) / exam.questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </div>
            </div>
            <motion.button
              onClick={() => setShowExitDialog(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 p-2 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"
              title="الخروج من الامتحان"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8"
          >
            {/* Question Text */}
            <div className="mb-8">
              <div className="inline-block bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {question.section ? `Section ${question.section}` : question.type.toUpperCase()}
              </div>
              {question.type === "codeoutput" || question.type === "mcq" && (question as any).question.includes("```") ? (
                <div className="bg-slate-900/50 border-2 border-slate-700 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">{question.question}</pre>
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-white">{question.question}</h2>
              )}
            </div>

            {/* Answer Options */}
            {question.type === "mcq" ? (
              <div className="space-y-3 mb-8">
                {(question as any).options.map((option: string, idx: number) => {
                  const optionLetter = String.fromCharCode(65 + idx)
                  const isSelected = answers[question.id] === optionLetter
                  const isCorrect = optionLetter === question.correct
                  const canChangeAnswer = !(session.correctionMode === "immediate" && isCurrentQuestionAnswered)

                  const shouldShowFeedback =
                    session.correctionMode === "immediate" && showFeedback && isCurrentQuestionAnswered

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => canChangeAnswer && handleAnswer(optionLetter)}
                      whileHover={canChangeAnswer ? { x: 4 } : {}}
                      whileTap={canChangeAnswer ? { scale: 0.98 } : {}}
                      disabled={!canChangeAnswer}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${shouldShowFeedback
                          ? isCorrect
                            ? "border-green-500 bg-green-500/10 text-green-300"
                            : isSelected
                              ? "border-red-500 bg-red-500/10 text-red-300"
                              : "border-slate-600 bg-slate-700/30 text-slate-200"
                          : isSelected
                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                            : "border-slate-600 bg-slate-700/30 text-slate-200 hover:border-cyan-400"
                        } ${!canChangeAnswer && isSelected ? "cursor-not-allowed" : ""}`}
                    >
                      <span className="font-bold">{optionLetter}.</span> {option}
                    </motion.button>
                  )
                })}
              </div>
            ) : question.type === "theory" ? (
              <div className="mb-8 space-y-4">
                <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4">
                  <p className="text-amber-200 text-sm flex items-center gap-2">
                    <span className="text-lg">ℹ️</span>
                    هذا سؤال نظري - اكتب إجابتك ثم اعرض الإجابة الصحيحة للمقارنة
                  </p>
                </div>
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => {
                    const canEdit = !(session.correctionMode === "immediate" && isCurrentQuestionAnswered)
                    if (canEdit) {
                      handleAnswer(e.target.value)
                    }
                  }}
                  disabled={session.correctionMode === "immediate" && isCurrentQuestionAnswered}
                  placeholder="أدخل إجابتك النظرية هنا..."
                  className="w-full px-4 py-3 bg-slate-700/30 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px] resize-none font-mono text-sm"
                />
                {!showTheoryAnswer && (
                  <motion.button
                    onClick={() => setShowTheoryAnswer(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 font-semibold rounded-xl hover:bg-amber-500/30 transition-all"
                  >
                    عرض الإجابة الصحيحة
                  </motion.button>
                )}
              </div>
            ) : question.type === "codeoutput" ? (
              <div className="mb-8 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">المخرجات المتوقعة:</label>
                  <textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => {
                      const canEdit = !(session.correctionMode === "immediate" && isCurrentQuestionAnswered)
                      if (canEdit) {
                        handleAnswer(e.target.value)
                      }
                    }}
                    disabled={session.correctionMode === "immediate" && isCurrentQuestionAnswered}
                    placeholder="اكتب مخرجات البرنامج..."
                    className="w-full px-4 py-3 bg-slate-700/30 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] resize-none font-mono text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) => {
                    const canEdit = !(session.correctionMode === "immediate" && isCurrentQuestionAnswered)
                    if (canEdit) {
                      handleAnswer(e.target.value)
                    }
                  }}
                  disabled={session.correctionMode === "immediate" && isCurrentQuestionAnswered}
                  placeholder="أدخل إجابتك هنا..."
                  className="w-full px-4 py-3 bg-slate-700/30 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* Feedback - shown after showing answer for theory or immediate feedback for others */}
            <AnimatePresence>
              {((question.type === "theory" && showTheoryAnswer) || (showFeedback && isCurrentQuestionAnswered && question.type !== "theory")) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-xl mb-8 border-2 ${question.type === "theory"
                      ? "bg-blue-500/10 border-blue-500 text-blue-300"
                      : isAnswerCorrect()
                        ? "bg-green-500/10 border-green-500 text-green-300"
                        : "bg-red-500/10 border-red-500 text-red-300"
                    }`}
                >
                  {question.type === "theory" ? (
                    <div>
                      <p className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        الإجابة الصحيحة (للمقارنة فقط):
                      </p>
                      <div className="bg-slate-900/30 rounded-lg p-3 border border-blue-400/30 text-sm text-blue-100 font-mono whitespace-pre-wrap break-words">
                        {question.correct}
                      </div>
                      <p className="text-xs mt-3 text-blue-200">
                        قارن إجابتك مع الإجابة الصحيحة. لا تؤثر الأسئلة النظرية على الدرجة.
                      </p>
                    </div>
                  ) : question.type === "codeoutput" ? (
                    <div>
                      <p className="font-semibold mb-2">{isAnswerCorrect() ? "✓ مخرجات صحيحة!" : "✗ مخرجات خاطئة"}</p>
                      {!isAnswerCorrect() && (
                        <div>
                          <p className="text-sm mb-2">المخرجات الصحيحة:</p>
                          <div className="bg-slate-900/30 rounded-lg p-2 border border-green-400/30 text-sm text-green-100 font-mono whitespace-pre-wrap break-words">
                            {question.correct}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold mb-2">{isAnswerCorrect() ? "✓ إجابة صحيحة!" : "✗ إجابة خاطئة"}</p>
                      {!isAnswerCorrect() && (
                        <p className="text-sm">
                          الإجابة الصحيحة: <span className="font-semibold text-base">{question.correct}</span>
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <motion.button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!hasAnsweredCurrentQuestion}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold"
            >
              {isLastQuestion ? "إنهاء" : "التالي"}
              {isLastQuestion ? <Send className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showExitDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowExitDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md"
            >
              <h3 className="text-2xl font-bold text-white mb-4">الخروج من الامتحان</h3>
              <p className="text-slate-300 mb-6">
                هل أنت متأكد من رغبتك في الخروج؟ سيتم حفظ إجاباتك ويمكنك استئناف الامتحان لاحقاً.
              </p>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowExitDialog(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                >
                  الرجوع
                </motion.button>
                <motion.button
                  onClick={onExit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                >
                  تأكيد الخروج
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
