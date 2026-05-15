'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Upload, Trash2, Lock, LogOut, FileText, Search, Plus, Edit3,
  AlertCircle, CheckCircle2, Loader2, ShieldCheck,
  Users, GraduationCap, X, User, Calendar, MessageSquare, Trophy, Star, Target, Sparkles, Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'

interface PDFFile { id: string; filename: string; uploadedAt: string; size?: number; term: string; category: string; url: string }
interface Student {
  id: string;
  full_name: string;
  student_code: string;
  email: string;
  created_at: string;
  examCount: number;
  totalScore: number;
  totalPossible: number;
  averagePercentage: number;
  perfectExamsCount: number;
  globalRankPoints?: number;
  globalRankPercentage?: number;
}
interface GradeRecord { id: string; exam_name: string; term: number; score: number; total_possible: number; completed_at: string; status: string }
interface Feedback { id: string; student_name: string; phone_number: string; instructor_rating: number; good_things: string; needs_improvement: string; platform_feedback: string; created_at: string }

const CATEGORIES = [
  { id: 'practical', label: 'عملي', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'theoretical', label: 'نظري', color: 'bg-purple-500/10 text-purple-500' },
  { id: 'revision', label: 'مراجعة نهائية', color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'general', label: 'عام', color: 'bg-slate-500/10 text-slate-500' }
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('materials')

  const [files, setFiles] = useState<PDFFile[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  const [fileSearch, setFileSearch] = useState('')
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentGrades, setStudentGrades] = useState<GradeRecord[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('1')
  const [selectedCategory, setSelectedCategory] = useState('practical')
  const [uploading, setUploading] = useState(false)

  const [rankingSystem, setRankingSystem] = useState<'points' | 'percentage'>('points')
  const [editingGrade, setEditingGrade] = useState<{ id: string, score: string, total: string } | null>(null)

  const ADMIN_PASSWORD = 'admin123'

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text }); setTimeout(() => setStatusMessage(null), 3000)
  }

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const [fRes, sRes, fbRes] = await Promise.all([
        fetch('/api/pdf-list'),
        fetch('/api/admin/students'),
        fetch('/api/admin/feedback')
      ])
      if (fRes.ok) setFiles((await fRes.json()).files || [])
      if (sRes.ok) setStudents((await sRes.json()).students || [])
      if (fbRes.ok) setFeedbacks((await fbRes.json()).feedbacks || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [isAuthenticated])

  useEffect(() => { loadData() }, [loadData])

  const rankedStudents = useMemo(() => {
    const byPoints = [...students].sort((a, b) =>
      (b.perfectExamsCount - a.perfectExamsCount) || (b.totalScore - a.totalScore) || (b.averagePercentage - a.averagePercentage) || a.full_name.localeCompare(b.full_name)
    )

    const byPercentage = [...students].sort((a, b) =>
      (b.averagePercentage - a.averagePercentage) || (b.totalScore - a.totalScore) || (b.perfectExamsCount - a.perfectExamsCount) || a.full_name.localeCompare(b.full_name)
    )

    return students.map(s => ({
      ...s,
      globalRankPoints: byPoints.findIndex(st => st.id === s.id) + 1,
      globalRankPercentage: byPercentage.findIndex(st => st.id === s.id) + 1
    }))
  }, [students])

  const sortedFilteredStudents = useMemo(() => {
    const filtered = rankedStudents.filter(s => s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) || s.student_code.toLowerCase().includes(studentSearch.toLowerCase()))

    return filtered.sort((a, b) => {
      if (rankingSystem === 'points') return (a.globalRankPoints || 0) - (b.globalRankPoints || 0)
      return (a.globalRankPercentage || 0) - (b.globalRankPercentage || 0)
    })
  }, [rankedStudents, studentSearch, rankingSystem])

  const filteredFiles = useMemo(() => files.filter(f => f.filename.toLowerCase().includes(fileSearch.toLowerCase())), [files, fileSearch])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('term', selectedTerm); fd.append('category', selectedCategory)
    try {
      const r = await fetch('/api/pdf-upload', { method: 'POST', body: fd })
      if (r.ok) { showStatus('success', 'تم الرفع'); loadData() } else showStatus('error', 'فشل الرفع')
    } catch { showStatus('error', 'خطأ اتصال') } finally { setUploading(false) }
  }

  const handleDelete = async (url: string, id: string) => {
    if (!confirm('متأكد؟')) return
    try {
      const r = await fetch(`${url}${id}`, { method: 'POST' })
      if (r.ok) { showStatus('success', 'تم الحذف'); loadData() }
    } catch { showStatus('error', 'خطأ اتصال') }
  }

  const loadGrades = async (s: Student) => {
    setSelectedStudent(s); setLoadingDetails(true); setEditingGrade(null)
    try {
      const r = await fetch(`/api/admin/student-grades?studentId=${s.id}`)
      if (r.ok) setStudentGrades((await r.json()).grades || [])
    } catch { } finally { setLoadingDetails(false) }
  }

  const handleUpdateGrade = async (id: string) => {
    if (!editingGrade) return
    try {
      const res = await fetch(`/api/admin/update-result?resultId=${id}`, {
        method: 'POST',
        body: JSON.stringify({ score: editingGrade.score, total_possible: editingGrade.total })
      })
      if (res.ok) {
        showStatus('success', 'تم تعديل الدرجة')
        setEditingGrade(null)
        if (selectedStudent) loadGrades(selectedStudent)
        loadData()
      }
    } catch { showStatus('error', 'خطأ في الاتصال') }
  }

  const handleDeleteGrade = async (id: string) => {
    if (!confirm('حذف هذه النتيجة؟')) return
    try {
      const res = await fetch(`/api/admin/delete-result?resultId=${id}`, { method: 'POST' })
      if (res.ok) {
        showStatus('success', 'تم حذف النتيجة')
        if (selectedStudent) loadGrades(selectedStudent)
        loadData()
      }
    } catch { showStatus('error', 'خطأ في الاتصال') }
  }

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-none p-6">
        <div className="text-center mb-8"><ShieldCheck className="w-12 h-12 text-red-600 mx-auto mb-4" /><h1 className="text-2xl font-black">مدير المنصة</h1></div>
        <form onSubmit={(e) => { e.preventDefault(); if (adminPassword === ADMIN_PASSWORD) setIsAuthenticated(true); else showStatus('error', 'خطأ') }} className="space-y-4">
          <input type="password" placeholder="كلمة المرور" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full h-12 border rounded-lg px-4" />
          <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-white">دخول</Button>
        </form>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black text-xl"><ShieldCheck className="text-red-600" /> Dashboard</div>
        <div className="flex gap-2"><Link href="/"><Button variant="ghost">الموقع</Button></Link><Button onClick={() => setIsAuthenticated(false)} variant="outline"><LogOut className="w-4 h-4" /></Button></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-xl">
            <TabsTrigger value="materials">الملفات</TabsTrigger>
            <TabsTrigger value="students">الطلاب والترتيب</TabsTrigger>
            <TabsTrigger value="feedback">التعليقات</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 h-fit bg-white border-none shadow-sm space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Upload /> رفع جديد</h3>
                <div className="grid grid-cols-2 gap-2" dir="rtl">
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">ترم 1</SelectItem><SelectItem value="2">ترم 2</SelectItem></SelectContent></Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="border-2 border-dashed rounded-xl p-8 bg-slate-50 relative text-center">
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {uploading ? <Loader2 className="animate-spin mx-auto" /> : <div className="text-sm">اضغط لرفع PDF</div>}
                </div>
              </Card>
              <div className="lg:col-span-2 space-y-4">
                <Input placeholder="بحث..." value={fileSearch} onChange={e => setFileSearch(e.target.value)} className="bg-white h-11" />
                <Card className="bg-white border-none shadow-sm overflow-hidden"><table className="w-full text-right" dir="rtl"><thead className="bg-slate-50 font-bold text-xs uppercase border-b"><tr><th className="p-4">الملف</th><th className="p-4 text-center">الترم</th><th className="p-4 text-left">حذف</th></tr></thead><tbody className="divide-y text-sm">
                  {filteredFiles.map(f => <tr key={f.id} className="hover:bg-slate-50"><td className="p-4 font-medium">{f.filename}</td><td className="p-4 text-center"><Badge variant="outline">ترم {f.term}</Badge></td><td className="p-4 text-left"><Button onClick={() => handleDelete('/api/pdf-delete?fileId=', f.id)} variant="ghost" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></td></tr>)}
                </tbody></table></Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
              <div className="order-first lg:order-last lg:col-span-4">
                {selectedStudent ? (
                  <Card className="bg-white border-none shadow-xl sticky top-24 overflow-hidden flex flex-col max-h-[70vh] lg:max-h-[calc(100vh-120px)] border">
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0" dir="rtl">
                      <div className="flex items-center gap-2 font-bold">
                        <Trophy className="text-yellow-400 w-5 h-5" />
                        <span className="truncate max-w-[200px]">{selectedStudent.full_name}</span>
                      </div>
                      <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="text-slate-500 p-1 hover:text-white h-7 w-7"><X className="w-4 h-4" /></Button>
                    </div>
                    <div className="overflow-y-auto flex-1 custom-scrollbar" dir="rtl">
                      {loadingDetails ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></div> :
                        studentGrades.length === 0 ? <div className="p-10 text-center text-slate-400">لا يوجد سجل امتحانات</div> :
                          <div className="divide-y">
                            {studentGrades.map(g => (
                              <div key={g.id} className="p-4 flex justify-between items-center hover:bg-slate-50 group">
                                <div className="space-y-1">
                                  <h4 className="font-bold text-sm tracking-tight">{g.exam_name}</h4>
                                  <p className="text-[10px] text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(g.completed_at || Date.now()).toLocaleDateString('ar-EG')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {editingGrade?.id === g.id ? (
                                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                                      <input type="number" value={editingGrade.score} onChange={e => setEditingGrade({ ...editingGrade, score: e.target.value })} className="w-10 h-8 border rounded text-center text-xs" />
                                      <span className="text-slate-300">/</span>
                                      <input type="number" value={editingGrade.total} onChange={e => setEditingGrade({ ...editingGrade, total: e.target.value })} className="w-10 h-8 border rounded text-center text-xs" />
                                      <Button size="sm" onClick={() => handleUpdateGrade(g.id)} className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600 p-0"><Check className="w-4 h-4" /></Button>
                                      <Button size="sm" variant="ghost" onClick={() => setEditingGrade(null)} className="h-8 w-8 p-0"><X className="w-4 h-4" /></Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="text-right">
                                        <div className={`text-lg font-black leading-none ${g.status === 'completed' ? 'text-red-600' : 'text-slate-400'}`}>
                                          {g.status === 'completed' ? g.score : '-'} <span className="text-[10px] text-slate-300 font-normal">/ {g.total_possible}</span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button onClick={() => setEditingGrade({ id: g.id, score: String(g.score), total: String(g.total_possible) })} variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-blue-500"><Edit3 className="w-3 h-3" /></Button>
                                        <Button onClick={() => handleDeleteGrade(g.id)} variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>}
                    </div>
                  </Card>
                ) : <div className="hidden lg:flex h-64 border-2 border-dashed border-slate-200 rounded-3xl items-center justify-center text-slate-300 font-bold p-8 text-center" dir="rtl">اختر طالباً لإدارة درجاته</div>}
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between" dir="rtl">
                  <Input placeholder="بحث بالاسم أو الكود..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="h-11 bg-white md:w-1/2" />
                  <div className="flex bg-white p-1 rounded-xl border shrink-0">
                    <button onClick={() => setRankingSystem('points')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${rankingSystem === 'points' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>بالنقاط</button>
                    <button onClick={() => setRankingSystem('percentage')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${rankingSystem === 'percentage' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>بالنسبة المئوية</button>
                  </div>
                </div>
                <Card className="bg-white border-none shadow-sm overflow-hidden">
                  <div className="overflow-x-auto"><table className="w-full text-right min-w-[700px]" dir="rtl"><thead className="bg-slate-50 font-bold text-xs border-b">
                    <tr><th className="p-4 w-[35%]">الطالب</th><th className="p-4 text-center">الترتيب</th><th className="p-4 text-center">إجمالي الدرجات</th><th className="p-4 text-center">التميز</th><th className="p-4 text-center">الامتحانات</th><th className="p-4 text-left">حذف</th></tr>
                  </thead><tbody className="divide-y text-sm">
                      {loading ? <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></td></tr> :
                        sortedFilteredStudents.map((s) => {
                          const currentRank = rankingSystem === 'points' ? s.globalRankPoints : s.globalRankPercentage
                          return (
                            <tr key={s.id} onClick={() => loadGrades(s)} className={`cursor-pointer hover:bg-slate-50 ${selectedStudent?.id === s.id ? 'bg-red-50 font-bold' : ''}`}>
                              <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-slate-400" /></div><div className="flex flex-col min-w-0"><span className="font-bold text-slate-900 truncate block">{s.full_name}</span><span className="text-[10px] text-slate-400 font-mono">#{s.student_code}</span></div></div></td>
                              <td className="p-4 text-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${currentRank! <= 3 ? 'bg-yellow-400 text-white shadow-md ring-2 ring-yellow-100' : 'bg-slate-100 text-slate-500'}`}>{currentRank}</div></td>
                              <td className="p-4 text-center"><div className="inline-flex flex-col"><span className="text-base font-black text-red-600 leading-none">{s.totalScore}</span><span className="text-[10px] text-slate-400 font-medium">{s.averagePercentage}%</span></div></td>
                              <td className="p-4 text-center">{s.perfectExamsCount > 0 ? <div className="flex items-center justify-center gap-1 text-yellow-500 font-black"><Sparkles className="w-4 h-4 fill-current" /><span>{s.perfectExamsCount}</span></div> : <span className="text-slate-200">-</span>}</td>
                              <td className="p-4 text-center"><Badge variant="outline" className="font-bold border-slate-200">{s.examCount}</Badge></td>
                              <td className="p-4 text-left"><Button onClick={(e) => { e.stopPropagation(); handleDelete('/api/admin/delete-student?studentId=', s.id); }} variant="ghost" className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button></td>
                            </tr>
                          )
                        })}
                    </tbody></table></div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <Card className="bg-white border-none shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right min-w-[800px]" dir="rtl">
                  <thead className="bg-slate-50 font-bold text-xs border-b">
                    <tr>
                      <th className="p-4">الطالب</th>
                      <th className="p-4 text-center">التاريخ</th>
                      <th className="p-4">المميزات</th>
                      <th className="p-4">السلبيات</th>
                      <th className="p-4 text-center">التقييم</th>
                      <th className="p-4 text-left">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {feedbacks.length === 0 ? <tr><td colSpan={6} className="py-20 text-center text-slate-400">لا توجد تعليقات حالياً</td></tr> :
                      feedbacks.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{f.student_name}</div>
                            <div className="text-[10px] text-slate-400">{f.phone_number}</div>
                          </td>
                          <td className="p-4 text-center text-[10px] text-slate-400 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(f.created_at || Date.now()).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                            </div>
                          </td>
                          <td className="p-4 text-xs text-emerald-600 max-w-xs">{f.good_things || '-'}</td>
                          <td className="p-4 text-xs text-red-600 max-w-xs">{f.needs_improvement || '-'}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-0.5 text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < f.instructor_rating ? 'fill-current' : 'text-slate-200'}`} />)}
                            </div>
                          </td>
                          <td className="p-4 text-left">
                            <Button onClick={() => handleDelete('/api/admin/feedback?id=', f.id)} variant="ghost" className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {statusMessage && <div className="fixed bottom-6 right-6 z-[100] bg-white px-6 py-3 rounded-xl shadow-2xl border border-slate-100 flex items-center gap-3 font-bold animate-in slide-in-from-bottom-2">{statusMessage.type === 'success' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />} {statusMessage.text}</div>}
    </div>
  )
}
