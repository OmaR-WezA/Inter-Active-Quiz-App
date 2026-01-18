'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, Trash2, Lock, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface PDFFile {
  id: string
  filename: string
  uploadedAt: string
}

export default function AdminPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  const ADMIN_PASSWORD = 'admin123'

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles()
    }
  }, [isAuthenticated])

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
      setIsAuthenticated(true)
      setShowPasswordPrompt(false)
    } else {
      alert('كلمة المرور غير صحيحة')
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
    const files = e.dataTransfer.files
    if (files) {
      handleFiles(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (fileList: FileList) => {
    const file = fileList[0]
    console.log('  File selected:', file.name, file.type)

    if (!file.type.includes('pdf')) {
      alert('الرجاء اختيار ملف PDF فقط')
      return
    }

    setLoading(true)
    setUploadingFile(file.name)

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('  Uploading file...', file.name)
      const response = await fetch('/api/pdf-upload', {
        method: 'POST',
        body: formData,
      })

      const responseData = await response.json()
      console.log('  Upload response:', responseData)

      if (response.ok) {
        console.log('  File uploaded successfully')
        alert('تم تحميل الملف بنجاح!')
        loadFiles()
      } else {
        console.error('  Upload error:', responseData)
        alert('خطأ في تحميل الملف: ' + (responseData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('  Error uploading file:', error)
      alert('خطأ في الاتصال: ' + String(error))
    } finally {
      setLoading(false)
      setUploadingFile(null)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('هل تريد حذف هذا الملف؟')) return

    console.log('  Deleting file:', fileId)

    try {
      const response = await fetch(`/api/pdf-delete?fileId=${fileId}`, {
        method: 'POST',
      })

      const data = await response.json()
      console.log('  Delete response:', data)

      if (response.ok) {
        alert('تم حذف الملف بنجاح')
        loadFiles()
      } else {
        alert('خطأ في حذف الملف: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('  Error deleting file:', error)
      alert('خطأ في الاتصال: ' + String(error))
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowPasswordPrompt(true)
    setAdminPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-800/90 border-red-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-white text-2xl">لوحة تحكم الإدارة</CardTitle>
              <CardDescription className="text-gray-400">
                أدخل كلمة المرور للوصول
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  autoFocus
                />
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  دخول
                </Button>
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    العودة للصفحة الرئيسية
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold text-white">إدارة ملفات PDF</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 bg-red-600/20 border-red-600 hover:bg-red-600/40 text-red-300"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </Button>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                تحميل ملف PDF جديد
              </CardTitle>
              <CardDescription className="text-gray-400">
                سحب الملف هنا أو اختر من جهازك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 hover:border-slate-500'
                  }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-1">اسحب ملف PDF هنا</p>
                <p className="text-gray-500 text-sm">أو اضغط لاختيار من جهازك</p>
              </div>

              {uploadingFile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-300"
                >
                  جاري تحميل: {uploadingFile}...
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Files List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5" />
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
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-all"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{file.filename}</p>
                        <p className="text-gray-400 text-sm">
                          تم التحميل: {new Date(file.uploadedAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDeleteFile(file.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
