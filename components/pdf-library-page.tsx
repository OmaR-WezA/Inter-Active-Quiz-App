'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, Trash2, ArrowLeft, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

interface PDFFile {
  id: string
  filename: string
  uploadedAt: string
}

interface Props {
  onBack: () => void
  isAdmin?: boolean
}

export default function PDFLibraryPage({ onBack, isAdmin = false }: Props) {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminMode, setIsAdminMode] = useState(isAdmin)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(!isAdmin)
  const [dragActive, setDragActive] = useState(false)

  const ADMIN_PASSWORD = 'admin123' // غير هذا لكلمة مرور قوية

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/pdf-list')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error loading files:', error)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminMode(true)
      setShowPasswordPrompt(false)
      toast({
        title: 'نجح',
        description: 'تم الدخول كمسؤول',
      })
    } else {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور غير صحيحة',
        variant: 'destructive',
      })
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      await uploadPDF(files[0])
    }
  }

  const uploadPDF = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      toast({
        title: 'خطأ',
        description: 'الملف يجب أن يكون PDF',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/pdf-upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({
          title: 'نجح',
          description: 'تم تحميل الملف بنجاح',
        })
        loadFiles()
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الملف',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadPDF(e.target.files[0])
    }
  }

  const downloadPDF = async (fileId: string, filename: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pdf-download?fileId=${fileId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الملف',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (fileId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟')) return

    try {
      const response = await fetch(`/api/pdf-delete?fileId=${fileId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast({
          title: 'نجح',
          description: 'تم حذف الملف',
        })
        loadFiles()
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف الملف',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-8 flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-400 rounded-xl px-4 py-2 text-slate-300 hover:text-blue-400 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>رجوع</span>
      </motion.button>

      {showPasswordPrompt && !isAdminMode ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                دخول المسؤول
              </CardTitle>
              <CardDescription className="text-gray-400">
                أدخل كلمة المرور للوصول إلى لوحة تحميل الملفات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button type="submit" className="w-full">
                  دخول
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          {isAdminMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">مكتبة ملفات PDF</h1>
                <div className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold">
                  وضع المسؤول
                </div>
              </div>

              {/* Upload Area */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    تحميل ملف PDF جديد
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    سحب وإفلات ملف PDF أو اختيار من الجهاز
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-blue-400 bg-blue-400/10'
                        : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      disabled={loading}
                      className="hidden"
                      id="pdf-input"
                    />
                    <label
                      htmlFor="pdf-input"
                      className="cursor-pointer block"
                    >
                      <Upload className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                      <p className="text-white font-semibold mb-2">
                        {loading ? 'جاري التحميل...' : 'اختر ملف PDF أو اسحبه هنا'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        الملفات سيتم حفظها وتطبيق الـ watermark عند تحميلها من المستخدمين
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Files List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  الملفات المتاحة ({files.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد ملفات حالياً
                  </p>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                      >
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {file.filename}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(file.uploadedAt).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              downloadPDF(file.id, file.filename)
                            }
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
                          >
                            <Download className="w-4 h-4" />
                            تحميل
                          </motion.button>
                          {isAdminMode && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteFile(file.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 text-gray-300 space-y-2"
          >
            <p className="font-semibold text-white">كيفية عمل النظام:</p>
            <ul className="space-y-1 text-sm">
              <li>• يتم حفظ ملفات PDF الأصلية بدون تعديل</li>
              <li>• عند تحميل الطالب للملف، يتم إضافة watermark "weza production" تلقائياً</li>
              <li>• الطالب يحصل على الملف مع الـ watermark على كل صفحة</li>
              <li>• الملف الأصلي يبقى محفوظاً بدون تعديل</li>
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  )
}
