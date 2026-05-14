"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Send, LogOut, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { APP_CONFIG } from "@/lib/config"

interface ExamPageProps {
  session: {
    username: string
    term: number
    examName: string
    correctionMode: "immediate" | "final"
    resumeId?: string // Link to an incomplete result
    initialAnswers?: Record<number, string>
    initialQuestionIdx?: number
  }
  onComplete: () => void
  onExit: () => void
  onStateChange?: (currentIdx: number, answers: Record<number, string>) => void
}

interface Question {
  id: number
  type: string
  question_text: string
  options?: string[]
  correct_answer: string
  marks: number
  section?: string
}

export default function ExamPage({ session, onComplete, onExit, onStateChange }: ExamPageProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>(session.initialAnswers || {})
  const [showFeedback, setShowFeedback] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showTheoryAnswer, setShowTheoryAnswer] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resultId, setResultId] = useState<string | null>(session.resumeId || null)

  useEffect(() => {
    fetchQuestions()
  }, [session.term, session.examName])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('term', session.term)
        .eq('exam_name', session.examName)
        .order('id', { ascending: true })

      if (error) {
        toast.error("حدث خطأ أثناء تحميل الأسئلة")
        console.error(error)
      } else {
        const mapped = data.map(q => ({
          id: q.id,
          type: q.type,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          marks: q.marks,
          section: q.section
        }))
        setQuestions(mapped)

        // If resuming, set properties
        if (session.initialQuestionIdx !== undefined && session.initialQuestionIdx !== null) {
          let startIdx = session.initialQuestionIdx
          // If the question at the saved index is already answered, and we are resuming, 
          // we might want to stay there to let them see their answer, OR move to next.
          // The user requested: "لو جاوبته ارجع علي السؤال ال بعديه"
          const savedAnswers = session.initialAnswers || {}
          const questionId = mapped[startIdx]?.id
          if (questionId && savedAnswers[questionId] && startIdx < mapped.length - 1) {
            // startIdx++ // Should we auto-advance? Let's check user's preference again.
            // "لو جاوبته ارجع علي السؤال ال بعديه" -> Yes, advance.
            startIdx++
          }
          setCurrentQuestionIdx(startIdx)
        }
      }
    } catch (err) {
      toast.error("فشل الاتصال بقاعدة البيانات")
    } finally {
      setLoading(false)
    }
  }

  const saveProgress = async (completed = false) => {
    const studentId = localStorage.getItem("student_id")
    if (!studentId) return

    // Calculate current score (only for completed ones)
    let scoredScore = 0
    let totalPossible = 0

    questions.forEach((q) => {
      const userAnswer = answers[q.id]
      // Include MCQ 
      if (q.type === "mcq") {
        totalPossible += q.marks || 1
        if (isAnswerCorrect(q, userAnswer || "")) scoredScore += q.marks || 1
      }
      // Include CodeOutput only if configured
      else if (q.type === "codeoutput" && APP_CONFIG.GRADE_PRACTICAL) {
        totalPossible += q.marks || 1
        if (isAnswerCorrect(q, userAnswer || "")) scoredScore += q.marks || 1
      }
    })

    const payload = {
      student_id: studentId,
      term: session.term,
      exam_name: session.examName,
      score: scoredScore,
      total_possible: totalPossible,
      answers: answers,
      status: completed ? 'completed' : 'incomplete',
      current_question: currentQuestionIdx,
      completed_at: new Date().toISOString()
    }

    try {
      if (resultId) {
        await supabase.from('exam_results').update(payload).eq('id', resultId)
      } else {
        const { data } = await supabase.from('exam_results').insert([payload]).select().single()
        if (data) setResultId(data.id)
      }
    } catch (err) {
      console.error("Error saving progress:", err)
    }
  }

  // Update backend when moving through questions
  useEffect(() => {
    if (!loading && questions.length > 0) {
      saveProgress(false)
      onStateChange?.(currentQuestionIdx, answers)
    }
  }, [currentQuestionIdx, answers])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <p className="text-xl">جاري تحميل الأسئلة...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-6">
        <p className="text-2xl text-slate-300">لا توجد أسئلة متوفرة لهذا الترم حالياً.</p>
        <button onClick={onExit} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all">
          رجوع
        </button>
      </div>
    )
  }

  const question = questions[currentQuestionIdx]
  const isLastQuestion = currentQuestionIdx === questions.length - 1
  const currentAnswer = answers[question.id]
  const hasAnsweredCurrentQuestion = currentAnswer !== undefined && currentAnswer !== ""
  const isCurrentQuestionAnswered = answeredQuestions.has(currentQuestionIdx)

  const splitQuestion = (text: string) => {
    // 1. Check for explicit newline
    if (text.includes('\n')) {
      const firstLineEnd = text.indexOf('\n')
      return {
        instruction: text.substring(0, firstLineEnd).trim(),
        code: text.substring(firstLineEnd + 1).trim()
      }
    }

    // 2. Check for colon + space (Standard format)
    if (text.includes(': ')) {
      const colonIdx = text.indexOf(': ')
      return {
        instruction: text.substring(0, colonIdx + 1).trim(),
        code: text.substring(colonIdx + 2).trim()
      }
    }

    return { instruction: "", code: text }
  }

  const { instruction, code } = splitQuestion(question.question_text)

  const highlightC = (text: string) => {
    // Standard professional dark theme highlighting
    const components = text.split(/(\b(?:int|char|float|double|void|return|if|else|switch|case|default|for|while|do|break|continue|include|define|const|short|long|static|unsigned|signed|struct|union|enum|sizeof|typedef)\b|#include\s+<.*?>|#define\s+.*|".*?"|''.*?''|\/\/.*|\/\*[\s\S]*?\*\/|\b\d+\b)/g);

    return components.map((part, i) => {
      if (/^(\/\/.*|\/\*[\s\S]*?\*\/)$/.test(part)) return <span key={i} className="text-green-500/80 italic">{part}</span>;
      if (/^(\b(?:int|char|float|double|void|return|if|else|switch|case|default|for|while|do|break|continue|include|define|const|short|long|static|unsigned|signed|struct|union|enum|sizeof|typedef)\b)$/.test(part)) return <span key={i} className="text-blue-400">{part}</span>;
      if (/^(".*?"|''.*?'')$/.test(part)) return <span key={i} className="text-orange-300">{part}</span>;
      if (/^(#include\s+<.*?>|#define\s+.*)$/.test(part)) return <span key={i} className="text-purple-400">{part}</span>;
      if (/^(\b\d+\b)$/.test(part)) return <span key={i} className="text-amber-300">{part}</span>;
      return part;
    });
  };

  const handleAnswer = (answer: string) => {
    if (session.correctionMode === "immediate" && isCurrentQuestionAnswered) {
      return
    }
    setAnswers({ ...answers, [question.id]: answer })
  }

  const isAnswerCorrect = (q: Question, ans: string) => {
    if (!ans) return false
    if (q.type === "mcq") {
      return ans.toUpperCase() === q.correct_answer.toUpperCase()
    }
    return ans.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
  }

  const handleNext = () => {
    if (question.type === "theory" && !showTheoryAnswer) {
      return
    }

    if (!hasAnsweredCurrentQuestion) {
      return
    }

    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestionIdx]))

    const isCorrect = isAnswerCorrect(question, answers[question.id])
    const delay = question.type === "theory" ? 0 : 2000

    if (session.correctionMode === "immediate") {
      // If feedback is already shown, proceed to next question manually
      if (showFeedback) {
        if (isLastQuestion) {
          completeExam()
        } else {
          setCurrentQuestionIdx(currentQuestionIdx + 1)
          setShowFeedback(false)
          setShowTheoryAnswer(false)
        }
        return
      }

      setShowFeedback(true)
      // If wrong, don't auto-advance. If correct, auto-advance as usual.
      if (!isCorrect && question.type !== "theory") {
        return
      }
    }

    if (isLastQuestion) {
      setTimeout(() => {
        completeExam()
      }, delay)
    } else {
      setTimeout(() => {
        setCurrentQuestionIdx(currentQuestionIdx + 1)
        setShowFeedback(false)
        setShowTheoryAnswer(false)
      }, delay)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
      setShowFeedback(false)
    }
  }

  const completeExam = async () => {
    setSubmitting(true)
    await saveProgress(true)
    setSubmitting(false)
    onComplete()
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl text-right" dir="rtl">
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex justify-between items-center gap-4">
            <motion.button
              onClick={() => setShowExitDialog(true)}
              className="p-2 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3 flex-row-reverse">
                <span className="text-sm font-semibold text-slate-300">
                  السؤال {currentQuestionIdx + 1} من {questions.length}
                </span>
                <span className="text-sm text-slate-400">
                  {Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Question Card */}
          <motion.div key={currentQuestionIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                    {question.section || question.type.toUpperCase()}
                  </div>
                  {(question.type === "mcq" || (question.type === "codeoutput" && APP_CONFIG.GRADE_PRACTICAL)) ? (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center">
                      Graded / محسوب
                    </div>
                  ) : (
                    <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center">
                      Self-Assessed / مراجعة
                    </div>
                  )}
                </div>
                {instruction && <span className="text-slate-400 text-xs">رقم السؤال: {question.id}</span>}
              </div>

              {/* Instruction Prompt */}
              {instruction && (
                <div className="mb-4 text-lg font-medium text-white text-left leading-relaxed" dir="ltr">
                  {instruction}
                </div>
              )}

              {/* Premium Code/Question Box (VS Code Style) */}
              <div className="bg-[#1e1e1e] border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/5" dir="ltr">
                {/* Terminal Header */}
                <div className="bg-[#252526] px-4 py-2 border-b border-[#333] flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    {question.type === 'theory' ? 'Logic.c — Visual Studio Code' : 'main.c — Visual Studio Code'}
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-4 font-mono text-[14px] md:text-[15px] leading-relaxed flex bg-[#1e1e1e] text-left items-start" dir="ltr">
                  {/* Line Numbers */}
                  <div className="pr-4 text-right text-slate-600 select-none border-r border-[#333] mr-4 flex flex-col min-w-[30px] shrink-0">
                    {code.split(/\n|\\n/).map((_, i) => (
                      <div key={i} className="h-[21px] md:h-[22.5px] leading-relaxed">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Highlighted Code */}
                  <div className="flex-1 overflow-x-auto whitespace-pre scrolling-touch pb-2 text-left">
                    {code.split(/\n|\\n/).map((line, i) => (
                      <div key={i} className="h-[21px] md:h-[22.5px] leading-relaxed text-slate-200 text-left">
                        {highlightC(line.replace(/\\n/g, '\n'))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            {question.type === "mcq" ? (
              <div className="space-y-3 mb-8" dir="ltr">
                {question.options?.map((option, idx) => {
                  const optionLetter = String.fromCharCode(65 + idx)
                  const isSelected = answers[question.id] === optionLetter
                  const isCorrect = optionLetter === question.correct_answer
                  const canChange = !(session.correctionMode === "immediate" && isCurrentQuestionAnswered)
                  const feedbackVisible = session.correctionMode === "immediate" && showFeedback && isCurrentQuestionAnswered

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => canChange && handleAnswer(optionLetter)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium flex items-center gap-4 ${feedbackVisible
                        ? isCorrect ? "border-green-500 bg-green-500/10 text-green-300" : isSelected ? "border-red-500 bg-red-500/10 text-red-300" : "border-slate-600 bg-slate-700/30 text-slate-200"
                        : isSelected ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-slate-600 bg-slate-700/30 text-slate-200 hover:border-cyan-400"
                        }`}
                    >
                      <span className="font-bold min-w-[24px]">{optionLetter}.</span>
                      <span>{option}</span>
                    </motion.button>
                  )
                })}
              </div>
            ) : question.type === "theory" ? (
              <div className="mb-8 space-y-4">
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="أدخل إجابتك النظرية هنا..."
                  className="w-full px-4 py-3 bg-slate-700/30 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-amber-400 transition-all min-h-[120px] resize-none text-left"
                  dir="auto"
                />
                {!showTheoryAnswer && (
                  <button onClick={() => setShowTheoryAnswer(true)} className="w-full py-3 bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 font-semibold rounded-xl">عرض الإجابة الصحيحة</button>
                )}
              </div>
            ) : (
              <div className="mb-8" dir="ltr">
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Answer here... / اكتب الإجابة هنا"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  className="w-full px-6 py-4 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white focus:border-cyan-500 outline-none font-mono text-lg shadow-inner"
                  dir="ltr"
                />
              </div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {((question.type === "theory" && showTheoryAnswer) || (showFeedback && isCurrentQuestionAnswered && question.type !== "theory")) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`p-4 rounded-xl mb-8 border-2 ${question.type === "theory" ? "bg-blue-500/10 border-blue-500 text-blue-300" : isAnswerCorrect(question, answers[question.id]) ? "bg-green-500/10 border-green-500 text-green-300" : "bg-red-500/10 border-red-500 text-red-300"}`}>
                  {question.type === "theory" ? (
                    <div className="text-sm font-mono whitespace-pre-wrap">{question.correct_answer}</div>
                  ) : (
                    <div>
                      <p>{isAnswerCorrect(question, answers[question.id]) ? "✓ إجابة صحيحة!" : `✗ إجابة خاطئة. الإجابة الصحيحة هي: ${question.correct_answer}`}</p>
                      {session.correctionMode === "immediate" && !isAnswerCorrect(question, answers[question.id]) && (
                        <p className="text-sm mt-1 font-bold animate-pulse text-white/80">⚠️ يرجى الضغط على زر "التالي" للمتابعة</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <motion.button
              onClick={handlePrevious}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" /> السابق
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={!hasAnsweredCurrentQuestion || submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 disabled:opacity-50 text-white rounded-xl transition-all font-semibold"
            >
              {isLastQuestion ? (submitting ? "جاري الحفظ..." : "إنهاء") : "التالي"}
              {isLastQuestion ? <Send className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Exit Dialog */}
      <AnimatePresence>
        {showExitDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExitDialog(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-right" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-4">الخروج من الامتحان</h3>
              <p className="text-slate-300 mb-6">هل أنت متأكد من رغبتك في الخروج؟</p>
              <div className="flex gap-4">
                <button onClick={() => setShowExitDialog(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-lg">الرجوع</button>
                <button onClick={onExit} className="flex-1 py-3 bg-red-600 text-white rounded-lg">تأكيد الخروج</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
