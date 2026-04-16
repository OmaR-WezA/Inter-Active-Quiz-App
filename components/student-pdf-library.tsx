"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, FileText, Search, Library, Layers, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface PDFFile {
  id: string
  name: string
  url: string
  term: number
  created_at: string
}

interface Props {
  onBack: () => void
}

export default function StudentPDFLibrary({ onBack }: Props) {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTerm, setActiveTerm] = useState<1 | 2>(1)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Error fetching PDFs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (url: string, filename: string, id: string) => {
    setDownloadingId(id)
    try {
      // If it's an internal API link, we can fetch it. If it's a direct URL, we can use window.open or a link.
      if (url.startsWith('/api')) {
        const response = await fetch(url)
        if (response.ok) {
          const blob = await response.blob()
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloadingId(null)
    }
  }

  const filteredFiles = files.filter(f => f.term === activeTerm)

  return (
    <div className="min-h-screen pb-20 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-6">
            <Library className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">مكتبة الملفات</h1>
          <p className="text-slate-400">جميع الملخصات والملفات التعليمية في مكان واحد</p>
        </div>

        {/* Term Tabs */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2].map((term) => (
            <button
              key={term}
              onClick={() => setActiveTerm(term as 1 | 2)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${activeTerm === term
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
            >
              <Layers className="w-5 h-5" />
              الترم {term === 1 ? 'الأول' : 'الثاني'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-800/40 rounded-[2rem] animate-pulse border border-slate-700/50" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-800/30 rounded-[3rem] border border-slate-700/30"
          >
            <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 text-lg font-bold">لا يوجد ملفات لهذا الترم حالياً</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-6 hover:border-blue-500/50 transition-all shadow-xl"
                >
                  <div className="bg-slate-900/50 rounded-2xl p-4 mb-5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                    <FileText className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{file.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    اضغط للتحميل والحفظ
                  </p>
                  <button
                    onClick={() => handleDownload(file.url, file.name, file.id)}
                    disabled={downloadingId === file.id}
                    className="w-full py-4 bg-slate-700 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    {downloadingId === file.id ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }}>
                        <Download className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        تحميل
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
