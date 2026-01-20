'use client';

import { useLocalStorageCleaner } from '@/hooks/useLocalStorageCleaner';

/**
 * مكون لإدارة تنظيف localStorage تلقائياً
 * ضع هذا المكون في layout.tsx أو الصفحة الرئيسية
 */
export function LocalStorageManager() {
  // التنظيف التلقائي كل 15 دقيقة
  useLocalStorageCleaner(15);

  return null; // هذا المكون لا يعرض أي شيء على الشاشة
}
