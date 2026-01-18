'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PDFFile {
  id: string
  filename: string
  uploadedAt: string
}

interface Props {
  onBack: () => void
}

export default function StudentPDFLibrary({ onBack }: Props) {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

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
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fileId: string, filename: string) => {
    console.log('  Download started for fileId:', fileId)
    setDownloadingId(fileId)
    try {
      const url = `/api/pdf-download?fileId=${fileId}`
      console.log('  Fetching from:', url)
      const response = await fetch(url)

      console.log('  Response status:', response.status)

      if (response.ok) {
        const blob = await response.blob()
        console.log('  Blob received, size:', blob.size, 'bytes')

        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        console.log('  Download completed')
        alert('تم تحميل الملف بنجاح!')
      } else {
        const errorData = await response.json()
        console.error('  Download error:', errorData)
        alert('خطأ في تحميل الملف: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('  Error downloading file:', error)
      alert('خطأ في الاتصال: ' + String(error))
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">مكتبة الملفات</h1>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            العودة
          </Button>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-blue-900/30 border-blue-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                معلومات مهمة
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>✓ يمكنك تحميل أي ملف من القائمة أدناه</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Files Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">جاري التحميل...</p>
            </div>
          ) : files.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">لا توجد ملفات متاحة حالياً</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <FileText className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white line-clamp-2 text-base">
                            {file.filename}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-xs mt-1">
                            {new Date(file.uploadedAt).toLocaleDateString('ar-EG')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-0">
                      <Button
                        onClick={() => handleDownload(file.id, file.filename)}
                        disabled={downloadingId === file.id}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {downloadingId === file.id ? 'جاري التحميل...' : 'تحميل'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
