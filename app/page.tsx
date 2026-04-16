"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import WelcomePage from "@/components/welcome-page"
import ExamSelectionPage from "@/components/exam-selection-page"
import ExamPage from "@/components/exam-page"
import ResultsPage from "@/components/results-page"
import ProfilePage from "@/components/profile-page"
import ResumeDialog from "@/components/resume-dialog"
import StudentPDFLibrary from "@/components/student-pdf-library"
import FeedbackPage from "@/components/feedback-page"
import LeaderboardPage from "@/components/leaderboard-page"
import GamesHubPage from "@/components/games-hub-page"
import MemoryGamePage from "@/components/memory-game-page"
import TicTacToePage from "@/components/tic-tac-toe-page"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabase"

type PageType = "welcome" | "selection" | "exam" | "results" | "profile" | "resume-dialog" | "pdf-library" | "feedback" | "leaderboard" | "games-hub" | "game" | "tic-tac-toe"

interface ExamSession {
  username: string
  term: number
  examName: string
  correctionMode: "immediate" | "final"
  resumeId?: string
  initialAnswers?: Record<number, string>
  initialQuestionIdx?: number
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("welcome")
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [viewingResultId, setViewingResultId] = useState<string | number | null>(null)

  const [pendingResume, setPendingResume] = useState<any>(null)

  useEffect(() => {
    const savedPage = localStorage.getItem("quiz_current_page") as PageType
    const savedSessionStr = localStorage.getItem("quiz_exam_session")
    const studentId = localStorage.getItem("student_id")
    const studentName = localStorage.getItem("student_name")

    if (studentId && studentName) {
      const restoreSession = async () => {
        let session = savedSessionStr ? JSON.parse(savedSessionStr) : { username: studentName, term: 1, examName: "", correctionMode: "immediate" }

        // If we were in an exam, fetch the ABSOLUTE LATEST from Supabase to avoid stale local storage
        if (savedPage === "exam" && session.examName) {
          const { data } = await supabase
            .from('exam_results')
            .select('*')
            .eq('student_id', studentId)
            .eq('term', session.term)
            .eq('exam_name', session.examName)
            .eq('status', 'incomplete')
            .order('completed_at', { ascending: false })
            .limit(1)

          if (data && data.length > 0) {
            const latest = data[0]
            session = {
              ...session,
              resumeId: latest.id,
              initialAnswers: latest.answers,
              initialQuestionIdx: latest.current_question
            }
          }
        }

        setExamSession(session)
        setCurrentPage(savedPage && savedPage !== "welcome" ? savedPage : "selection")
      }

      restoreSession()
    }
  }, [])

  useEffect(() => {
    if (currentPage !== "welcome") {
      localStorage.setItem("quiz_current_page", currentPage)
    }
    if (examSession) {
      localStorage.setItem("quiz_exam_session", JSON.stringify(examSession))
    }
  }, [currentPage, examSession])

  const handleStartExam = (username: string) => {
    localStorage.setItem("student_name", username)
    setExamSession({ username, term: 1, examName: "", correctionMode: "immediate" })
    setCurrentPage("selection")
  }

  const handleSelectExam = async (term: number, examName: string, correctionMode: "immediate" | "final") => {
    const studentId = localStorage.getItem("student_id")
    if (!studentId || !examSession) return

    // Check for incomplete exams
    const { data } = await supabase
      .from('exam_results')
      .select('*')
      .eq('student_id', studentId)
      .eq('term', term)
      .eq('exam_name', examName)
      .eq('status', 'incomplete')
      .order('completed_at', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setPendingResume({
        ...data[0],
        correctionMode
      })
      setCurrentPage("resume-dialog")
    } else {
      setExamSession({ ...examSession, term, examName, correctionMode, resumeId: undefined, initialAnswers: {}, initialQuestionIdx: 0 })
      setCurrentPage("exam")
    }
  }

  const handleResume = () => {
    if (pendingResume && examSession) {
      setExamSession({
        ...examSession,
        term: pendingResume.term,
        examName: pendingResume.exam_name,
        correctionMode: pendingResume.correctionMode,
        resumeId: pendingResume.id,
        initialAnswers: pendingResume.answers,
        initialQuestionIdx: pendingResume.current_question
      })
      setCurrentPage("exam")
      setPendingResume(null)
    }
  }

  const handleStartNew = (term: number, examName: string, correctionMode: "immediate" | "final") => {
    if (examSession) {
      setExamSession({ ...examSession, term, examName, correctionMode, resumeId: undefined, initialAnswers: {}, initialQuestionIdx: 0 })
      setCurrentPage("exam")
      setPendingResume(null)
    }
  }

  const handleExamComplete = () => {
    setViewingResultId(null)
    setCurrentPage("results")
  }

  const handleViewProfile = (username: string) => {
    setViewingResultId(null)
    if (examSession) {
      setExamSession({ ...examSession, username })
    }
    setCurrentPage("profile")
  }

  const handleExitExam = () => {
    setCurrentPage("selection")
  }

  const handleExamStateChange = (currentIdx: number, answers: Record<number, string>) => {
    if (examSession) {
      setExamSession({
        ...examSession,
        initialQuestionIdx: currentIdx,
        initialAnswers: answers
      })
    }
  }

  const handleBackHome = () => {
    // If logged in, stay on selection. If not, go to welcome.
    const studentId = localStorage.getItem("student_id")
    if (studentId) {
      setCurrentPage("selection")
    } else {
      setCurrentPage("welcome")
    }
  }

  const handleOpenPDFLibrary = () => {
    setCurrentPage("pdf-library")
  }

  const handleLogout = () => {
    localStorage.removeItem("student_id")
    localStorage.removeItem("student_name")
    localStorage.removeItem("student_email")
    localStorage.removeItem("quiz_current_page")
    localStorage.removeItem("quiz_exam_session")
    setExamSession(null)
    setCurrentPage("welcome")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {currentPage !== "exam" && (
        <Navbar
          username={examSession?.username}
          isLoggedIn={!!examSession}
          activePage={currentPage}
          onNavigate={(page) => {
            if (page === "welcome" && examSession) {
              setCurrentPage("selection")
            } else {
              setCurrentPage(page)
            }
            localStorage.setItem("quiz_current_page", page)
          }}
          onLogout={handleLogout}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={currentPage !== "exam" ? "pt-24" : ""}
      >
        {currentPage === "welcome" && <WelcomePage onStart={handleStartExam} onOpenPDFLibrary={handleOpenPDFLibrary} />}
        {currentPage === "selection" && examSession && (
          <ExamSelectionPage
            onSelect={handleSelectExam}
            onBack={handleBackHome}
            onViewProfile={() => handleViewProfile(examSession.username)}
          />
        )}
        {currentPage === "exam" && examSession && (
          <ExamPage
            session={examSession}
            onComplete={handleExamComplete}
            onExit={handleExitExam}
            onStateChange={handleExamStateChange}
          />
        )}
        {currentPage === "results" && examSession && (
          <ResultsPage
            session={examSession}
            resultId={viewingResultId || undefined}
            onViewProfile={() => handleViewProfile(examSession.username)}
            onBackHome={() => {
              setViewingResultId(null)
              handleExitExam()
            }}
          />
        )}
        {currentPage === "profile" && examSession && (
          <ProfilePage
            username={examSession.username}
            onBackHome={handleExitExam}
            onViewResult={(id) => {
              setViewingResultId(id)
              setCurrentPage("results")
            }}
            onResume={(attempt) => {
              setPendingResume({
                id: attempt.id,
                term: attempt.term,
                exam_name: attempt.exam_name,
                answers: attempt.answers,
                current_question: attempt.current_question,
                correctionMode: "immediate" // Default for profile resume
              })
              setCurrentPage("resume-dialog")
            }}
          />
        )}
        {currentPage === "resume-dialog" && examSession && pendingResume && (
          <ResumeDialog
            username={examSession.username}
            term={pendingResume.term}
            examName={pendingResume.exam_name}
            onResume={handleResume}
            onNew={() => handleStartNew(pendingResume.term, pendingResume.exam_name, pendingResume.correctionMode)}
            onCancel={() => setCurrentPage("selection")}
          />
        )}
        {currentPage === "pdf-library" && (
          <StudentPDFLibrary onBack={handleBackHome} />
        )}
        {currentPage === "feedback" && (
          <FeedbackPage onBack={handleBackHome} />
        )}
        {currentPage === "leaderboard" && (
          <LeaderboardPage onBackHome={handleBackHome} currentUsername={examSession?.username} />
        )}
        {currentPage === "games-hub" && (
          <GamesHubPage
            onBackHome={handleBackHome}
            onSelectGame={(gameId) => setCurrentPage(gameId as PageType)}
          />
        )}
        {currentPage === "game" && (
          <MemoryGamePage
            onBackHome={() => setCurrentPage("games-hub")}
            onWinAction={() => setCurrentPage("feedback")}
          />
        )}
        {currentPage === "tic-tac-toe" && (
          <TicTacToePage
            onBackHome={() => setCurrentPage("games-hub")}
            onWinAction={() => setCurrentPage("feedback")}
          />
        )}
      </motion.div>
    </main>
  )
}
