export interface UserProfile {
  name: string
  joinDate: string
  exams: ExamResult[]
  currentSession?: {
    examType: "final" | "mcq"
    correctionMode: "immediate" | "final"
    currentQuestion: number
    answers: Record<number, string>
    startedAt: string
  }
}

export interface ExamResult {
  id: string
  examType: "final" | "mcq"
  correctionMode: "immediate" | "final"
  score?: number
  totalMarks: number
  percentage?: number
  completedAt?: string
  startedAt: string
  status: "completed" | "incomplete"
  answers: Record<number, string>
  mcqCorrect?: number
  mcqTotal?: number
}

const STORAGE_KEY = "python_exam_app"

export const storage = {
  getUser: (name: string): UserProfile | null => {
    if (!name) return null
    try {
      const key = `${STORAGE_KEY}_user_${name}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("[v0] Error getting user:", error)
      return null
    }
  },

  createUser: (name: string): UserProfile => {
    const profile: UserProfile = {
      name,
      joinDate: new Date().toISOString(),
      exams: [],
    }
    const key = `${STORAGE_KEY}_user_${name}`
    try {
      localStorage.setItem(key, JSON.stringify(profile))
    } catch (error) {
      console.error("[v0] Error creating user:", error)
    }
    return profile
  },

  saveExamSession: (
    name: string,
    examType: "final" | "mcq",
    correctionMode: "immediate" | "final",
    currentQuestion: number,
    answers: Record<number, string>,
  ): void => {
    if (!name) return
    try {
      const user = storage.getUser(name) || storage.createUser(name)
      user.currentSession = {
        examType,
        correctionMode,
        currentQuestion,
        answers,
        startedAt: user.currentSession?.startedAt || new Date().toISOString(),
      }
      const key = `${STORAGE_KEY}_user_${name}`
      localStorage.setItem(key, JSON.stringify(user))
    } catch (error) {
      console.error("[v0] Error saving session:", error)
    }
  },

  getCurrentSession: (name: string) => {
    if (!name) return null
    try {
      const user = storage.getUser(name)
      return user?.currentSession || null
    } catch (error) {
      console.error("[v0] Error getting session:", error)
      return null
    }
  },

  saveIncompleteExam: (
    name: string,
    examType: "final" | "mcq",
    answers: Record<number, string>,
    totalMarks: number,
  ): void => {
    if (!name) return
    try {
      const user = storage.getUser(name) || storage.createUser(name)
      const incompleteExam: ExamResult = {
        id: Date.now().toString(),
        examType,
        correctionMode: "incomplete" as any,
        totalMarks,
        startedAt: user.currentSession?.startedAt || new Date().toISOString(),
        status: "incomplete",
        answers,
      }
      user.exams.push(incompleteExam)
      user.currentSession = undefined
      const key = `${STORAGE_KEY}_user_${name}`
      localStorage.setItem(key, JSON.stringify(user))
    } catch (error) {
      console.error("[v0] Error saving incomplete exam:", error)
    }
  },

  saveExamResult: (name: string, result: ExamResult): void => {
    if (!name) return
    try {
      const user = storage.getUser(name) || storage.createUser(name)
      result.status = "completed"
      result.startedAt = user.currentSession?.startedAt || new Date().toISOString()
      result.completedAt = new Date().toISOString()
      user.exams.push(result)
      user.currentSession = undefined
      const key = `${STORAGE_KEY}_user_${name}`
      localStorage.setItem(key, JSON.stringify(user))
    } catch (error) {
      console.error("[v0] Error saving result:", error)
    }
  },

  clearCurrentSession: (name: string): void => {
    if (!name) return
    try {
      const user = storage.getUser(name)
      if (user) {
        user.currentSession = undefined
        const key = `${STORAGE_KEY}_user_${name}`
        localStorage.setItem(key, JSON.stringify(user))
      }
    } catch (error) {
      console.error("[v0] Error clearing session:", error)
    }
  },

  getUserNames: (): string[] => {
    try {
      const keys = Object.keys(localStorage)
      return keys
        .filter((key) => key.startsWith(`${STORAGE_KEY}_user_`))
        .map((key) => key.replace(`${STORAGE_KEY}_user_`, ""))
    } catch {
      return []
    }
  },
}
