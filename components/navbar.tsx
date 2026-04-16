"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, BookOpen, Star, Trophy, LogOut, Home, LogIn, Menu, X } from "lucide-react"

interface NavbarProps {
    username?: string | null
    onNavigate: (page: any) => void
    onLogout: () => void
    activePage: string
    isLoggedIn: boolean
}

export default function Navbar({ username, onNavigate, onLogout, activePage, isLoggedIn }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = isLoggedIn
        ? [
            { id: "welcome", label: "الرئيسية", icon: Home },
            { id: "pdf-library", label: "المكتبة", icon: BookOpen },
            { id: "profile", label: "الملف الشخصي", icon: User },
            { id: "feedback", label: "التقييم", icon: Star },
            { id: "leaderboard", label: "جدول الترتيب", icon: Trophy, disabled: false },
        ]
        : [
            { id: "welcome", label: "الرئيسية", icon: Home },
            { id: "pdf-library", label: "المكتبة", icon: BookOpen },
            { id: "leaderboard", label: "جدول الترتيب", icon: Trophy, disabled: false },
        ]

    const handleNavigation = (id: string) => {
        onNavigate(id)
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4">
            <div className="max-w-7xl mx-auto h-20 flex items-center justify-between" dir="rtl">

                {/* User Branding */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <User className="text-white w-6 h-6" />
                    </div>
                    <div>
                        {isLoggedIn ? (
                            <>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">مرحباً بك</p>
                                <p className="text-white font-black">{username}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">منصة كويزات</p>
                                <p className="text-white font-black">أهلاً بك</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Navigation Items */}
                <div className="hidden md:flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/50">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            disabled={item.disabled}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm ${activePage === item.id
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/20"
                                : item.disabled
                                    ? "text-slate-600 cursor-not-allowed"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                                }`}
                        >
                            <item.icon className="w-4.5 h-4.5" />
                            {item.label}
                            {item.disabled && <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 mr-1">قريباً</span>}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggle button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 bg-slate-800/50 rounded-lg text-slate-300 hover:text-white border border-slate-700"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="h-8 w-px bg-slate-800 mx-1 hidden sm:block" />

                    <div className="hidden sm:block">
                        {isLoggedIn ? (
                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-5 py-2.5 rounded-xl transition-all font-bold text-sm"
                            >
                                <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform" />
                                <span>تسجيل الخروج</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => onNavigate("welcome")}
                                className="group flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 px-5 py-2.5 rounded-xl transition-all font-bold text-sm"
                            >
                                <LogIn className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                                <span>تسجيل الدخول</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-slate-900 border-b border-slate-800"
                        dir="rtl"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    disabled={item.disabled}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activePage === item.id
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                                        : item.disabled
                                            ? "text-slate-600 bg-slate-800/30 cursor-not-allowed"
                                            : "text-slate-300 hover:bg-slate-800"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                    {item.disabled && <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-400 mr-auto">قريباً</span>}
                                </button>
                            ))}

                            <hr className="border-slate-800 my-2" />

                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        onLogout()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    تسجيل الخروج
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleNavigation("welcome")}
                                    className="flex items-center gap-3 p-3 text-blue-400 hover:bg-blue-500/10 rounded-xl font-bold transition-all"
                                >
                                    <LogIn className="w-5 h-5" />
                                    تسجيل الدخول
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
