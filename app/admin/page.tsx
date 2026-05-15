'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Download,
  Trash2,
  Lock,
  LogOut,
  FileText,
  Search,
  Plus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Filter,
  Tag,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'

interface PDFFile {
  id: string
  filename: string
  uploadedAt: string
  size?: number
  term: string
  category: string
}

const CATEGORIES = [
  { id: 'practical', label: 'عملي', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'theoretical', label: 'نظري', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'revision', label: 'مراجعة نهائية', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'general', label: 'عام', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
]

export default function AdminPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<PDFFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Upload State
  const [selectedTerm, setSelectedTerm] = useState('1')
  const [selectedCategory, setSelectedCategory] = useState('practical')

  // Filter State
  const [filterTerm, setFilterTerm] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const ADMIN_PASSWORD = 'admin123'

  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pdf-list')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
        setFilteredFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error loading files:', error)
      showStatus('error', 'فشل تحميل قائمة الملفات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles()
    }
  }, [isAuthenticated, loadFiles])

  useEffect(() => {
    let filtered = files.filter(file =>
      file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (filterTerm !== 'all') {
      filtered = filtered.filter(f => f.term === filterTerm)
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(f => f.category === filterCategory)
    }

    setFilteredFiles(filtered)
  }, [searchQuery, files, filterTerm, filterCategory])

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text })
    setTimeout(() => setStatusMessage(null), 5000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      showStatus('error', 'كلمة المرور غير صحيحة')
      setAdminPassword('')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles?.length) {
      handleFiles(droppedFiles)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (fileList: FileList) => {
    const file = fileList[0]
    if (!file.type.includes('pdf')) {
      showStatus('error', 'الرجاء اختيار ملف PDF فقط')
      return
    }

    setUploading(true)
    setUploadProgress(10)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('term', selectedTerm)
    formData.append('category', selectedCategory)

    try {
      const response = await fetch('/api/pdf-upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadProgress(100)
        showStatus('success', 'تم رفع الملف بنجاح!')
        loadFiles()
      } else {
        const errorData = await response.json()
        showStatus('error', `فشل الرفع: ${errorData.error || 'خطأ مجهول'}`)
      }
    } catch (error) {
      showStatus('error', 'حدث خطأ في الاتصال بالسيرفر')
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return

    try {
      const response = await fetch(`/api/pdf-delete?fileId=${fileId}`, {
        method: 'POST',
      })

      if (response.ok) {
        showStatus('success', 'تم حذف الملف بنجاح')
        loadFiles()
      } else {
        showStatus('error', 'فشل حذف الملف')
      }
    } catch (error) {
      showStatus('error', 'حدث خطأ في الاتصال')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminPassword('')
  }

  const getCategoryLabel = (id: string) => {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[3]
  }

  // --- Auth Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md z-10"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 shadow-xl shadow-red-900/20 mb-6"
            >
              <ShieldCheck className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Admin Portal</h1>
            <p className="text-slate-400">نظام إدارة المحتوى التعليمي</p>
          </div>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" />
                تسجيل الدخول
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="كلمة مرور المسؤول"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-slate-950/50 border-slate-800 text-white h-12 focus:ring-red-500/50"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg font-medium transition-all"
                >
                  دخول النظام
                </Button>

                <Link href="/" className="block">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50 gap-2"
                  >
                    العودة للموقع
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // --- Main Dashboard Screen ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-red-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">Admin Panel</h1>
                <p className="text-xs text-slate-500 tracking-wider">QUIZ APP MANAGER</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm">
                  عرض الموقع
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-slate-800 bg-slate-900 hover:bg-red-900/20 hover:border-red-900/50 hover:text-red-400 text-slate-300 transition-all px-4"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar / Upload Panel */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-500" />
                    إضافة محتوى جديد
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categorization Pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">الترم</label>
                      <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                        <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white">
                          <SelectValue placeholder="اختر الترم" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="1">الترم الأول</SelectItem>
                          <SelectItem value="2">الترم الثاني</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">التصنيف</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white">
                          <SelectValue placeholder="اختر التصنيف" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative group border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive
                      ? 'border-red-500 bg-red-500/5'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/30'
                      }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />

                    <div className="mb-4 inline-flex p-3 rounded-full bg-slate-800 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-red-500" />
                      )}
                    </div>

                    <h3 className="text-white font-medium mb-1">رفع ملف PDF</h3>
                    <p className="text-slate-500 text-xs">سيرفع إلى: Term {selectedTerm} • {getCategoryLabel(selectedCategory).label}</p>

                    {uploading && (
                      <div className="mt-4 w-full">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-red-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">إجمالي الملفات المرفوعة</span>
                    <FileText className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-white">{files.length}</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content / File Management */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Toolbar & Filters */}
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="ابحث عن ملف..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 h-10"
                    />
                  </div>

                  <AnimatePresence>
                    {statusMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                      >
                        {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {statusMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-slate-800/50 shadow-inner">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider mr-2">
                    <Filter className="w-3.5 h-3.5" />
                    تصفية:
                  </div>

                  <Select value={filterTerm} onValueChange={setFilterTerm}>
                    <SelectTrigger className="w-[140px] h-9 bg-slate-950/50 border-slate-800 text-xs">
                      <SelectValue placeholder="حسب الترم" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="all">كل الأترام</SelectItem>
                      <SelectItem value="1">الترم الأول</SelectItem>
                      <SelectItem value="2">الترم الثاني</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[140px] h-9 bg-slate-950/50 border-slate-800 text-xs">
                      <SelectValue placeholder="حسب التصنيف" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="all">كل التصنيفات</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(filterTerm !== 'all' || filterCategory !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setFilterTerm('all'); setFilterCategory('all'); }}
                      className="text-[10px] text-slate-400 hover:text-white h-7"
                    >
                      إعادة تعيين
                    </Button>
                  )}
                </div>
              </div>

              {/* Files Table */}
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" dir="rtl">
                    <thead>
                      <tr className="border-b border-slate-800/50 bg-slate-950/30 text-right">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">اسم الملف</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">الترم</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">التصنيف</th>
                        <th className="px-6 py-4 text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
                            <p className="text-slate-500">جاري تحميل البيانات...</p>
                          </td>
                        </tr>
                      ) : filteredFiles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <div className="mb-4 inline-flex p-4 rounded-full bg-slate-800/50">
                              <FileText className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-white font-medium">لا توجد ملفات</h3>
                            <p className="text-slate-500 text-sm mt-1">لا توجد ملفات تطابق معايير البحث أو التصفية</p>
                          </td>
                        </tr>
                      ) : (
                        filteredFiles.map((file) => (
                          <motion.tr
                            layout
                            key={file.id}
                            className="group hover:bg-slate-800/20 transition-colors"
                          >
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-800 text-red-400 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="max-w-[180px] sm:max-w-xs overflow-hidden">
                                  <p className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">
                                    {file.filename}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] text-slate-500 font-mono">ID: {file.id}</span>
                                    <span className="text-slate-700">•</span>
                                    <span className="text-[9px] text-slate-500 flex items-center gap-1">
                                      <Calendar className="w-2.5 h-2.5" />
                                      {new Date(file.uploadedAt).toLocaleDateString('ar-EG')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant="outline" className={`bg-slate-800 border-slate-700 text-slate-300 font-bold px-2 py-0.5 text-[10px]`}>
                                ترم {file.term || '1'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant="outline" className={`border-transparent px-2 py-0.5 text-[10px] font-bold ${getCategoryLabel(file.category).color}`}>
                                {getCategoryLabel(file.category).label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleDeleteFile(file.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest pt-4">
                Powered by Interactive Quiz Engine • Organized by Term & Category
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
