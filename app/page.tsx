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
import { storage } from "@/lib/storage"
import { examData } from "@/lib/exam-data"
import PDFLibraryPage from "@/components/pdf-library-page"

type PageType = "welcome" | "selection" | "exam" | "results" | "profile" | "resume-dialog" | "pdf-library"

interface ExamSession {
  username: string
  examType: "final" | "mcq" | "pythonAdvanced" | "pythonTopGrade" | "ExtraExam"
  correctionMode: "immediate" | "final"
  resumeData?: {
    currentQuestion: number
    answers: Record<number, string>
  }
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("welcome")
  const [examSession, setExamSession] = useState<ExamSession | null>(null)

  useEffect(() => {
    const lastUsername = localStorage.getItem("last_username")
    if (lastUsername) {
      const savedSession = storage.getCurrentSession(lastUsername)
      if (savedSession) {
        setExamSession({
          username: lastUsername,
          examType: savedSession.examType,
          correctionMode: savedSession.correctionMode,
          resumeData: {
            currentQuestion: savedSession.currentQuestion,
            answers: savedSession.answers,
          },
        })
        setCurrentPage("resume-dialog")
      }
    }
  }, [])

  const handleStartExam = (username: string) => {
    localStorage.setItem("last_username", username)
    setExamSession({ username, examType: "final", correctionMode: "immediate" })
    setCurrentPage("selection")
  }

  const handleSelectExam = (examType: "final" | "mcq" | "pythonAdvanced" | "pythonTopGrade" | "ExtraExam", correctionMode: "immediate" | "final") => {
    console.log("[v0] handleSelectExam called with examType:", examType, "correctionMode:", correctionMode)
    if (examSession) {
      const newSession = { ...examSession, examType, correctionMode }
      console.log("[v0] Setting new exam session:", newSession)
      setExamSession(newSession)
      setCurrentPage("exam")
    }
  }

  const handleExamComplete = () => {
    setCurrentPage("results")
  }

  const handleResumeExam = () => {
    setCurrentPage("exam")
  }

  const handleNewExam = () => {
    if (examSession) {
      storage.clearCurrentSession(examSession.username)
      setExamSession({ ...examSession, resumeData: undefined })
      setCurrentPage("exam")
    }
  }

  const handleViewProfile = (username: string) => {
    setExamSession({ ...examSession!, username })
    setCurrentPage("profile")
  }

  const handleBackHome = () => {
    setCurrentPage("welcome")
    setExamSession(null)
    localStorage.removeItem("last_username")
  }

  const handleOpenPDFLibrary = () => {
    setCurrentPage("pdf-library")
  } // Added function declaration for handleOpenPDFLibrary

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {currentPage === "welcome" && <WelcomePage onStart={handleStartExam} onOpenPDFLibrary={handleOpenPDFLibrary} />}
        {currentPage === "selection" && examSession && (
          <ExamSelectionPage onSelect={handleSelectExam} onBack={handleBackHome} />
        )}
        {currentPage === "resume-dialog" && examSession && (
          <ResumeDialog
            username={examSession.username}
            examType={examSession.examType}
            onResume={handleResumeExam}
            onNew={handleNewExam}
            onCancel={handleBackHome}
          />
        )}
        {currentPage === "exam" && examSession && (
          <ExamPage
            session={examSession}
            onComplete={handleExamComplete}
            onExit={() => {
              if (examSession) {
                storage.saveIncompleteExam(
                  examSession.username,
                  examSession.examType,
                  {},
                  examData[examSession.examType].marks,
                )
              }
              handleBackHome()
            }}
          />
        )}
        {currentPage === "results" && examSession && (
          <ResultsPage
            session={examSession}
            onViewProfile={() => handleViewProfile(examSession.username)}
            onBackHome={handleBackHome}
          />
        )}
        {currentPage === "profile" && examSession && (
          <ProfilePage username={examSession.username} onBackHome={handleBackHome} />
        )}
        {currentPage === "pdf-library" && (
          <StudentPDFLibrary onBack={handleBackHome} />
        )}
        {/* {currentPage === "pdf-library" && (
          <PDFLibraryPage onBack={handleBackHome} />
        )} */}
      </motion.div>
    </main>
  )
}
