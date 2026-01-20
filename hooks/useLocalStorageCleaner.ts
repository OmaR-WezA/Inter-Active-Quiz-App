'use client';

import { useEffect } from 'react';

/**
 * Hook لتنظيف localStorage تلقائياً كل 15 دقيقة
 * يساعد في حل مشاكل تضارب البيانات عند فتح أكثر من امتحان
 */
export const useLocalStorageCleaner = (intervalMinutes: number = 15) => {
  useEffect(() => {
    // دالة للتنظيف
    const cleanLocalStorage = () => {
      try {
        // سجل رسالة للتحقق من التنفيذ
        console.log('[LocalStorage Cleaner] بدء التنظيف التلقائي...');
        
        // احصل على قائمة المفاتيح المراد محفوظها (اختياري)
        const keysToPreserve = [
          'theme', // إذا كنت تحفظ المظهر
          'user-preferences', // أي بيانات مهمة تريد الاحتفاظ بها
        ];

        // تنظيف جميع المفاتيح ما عدا المحفوظة
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !keysToPreserve.includes(key)) {
            keysToDelete.push(key);
          }
        }

        // حذف المفاتيح
        keysToDelete.forEach((key) => {
          localStorage.removeItem(key);
          console.log(`[LocalStorage Cleaner] تم حذف: ${key}`);
        });

        console.log(
          `[LocalStorage Cleaner] تم تنظيف ${keysToDelete.length} عناصر من localStorage`
        );
      } catch (error) {
        console.error('[LocalStorage Cleaner] خطأ أثناء التنظيف:', error);
      }
    };

    // قم بالتنظيف عند تحميل الصفحة لأول مرة
    cleanLocalStorage();

    // حدد وقت التنظيف التلقائي
    const intervalMs = intervalMinutes * 60 * 1000; // تحويل الدقائق إلى ميلي ثانية
    const intervalId = setInterval(cleanLocalStorage, intervalMs);

    // تنظيف الفترة الزمنية عند فك التثبيت
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMinutes]);
};

/**
 * دالة منفصلة لتنظيف اليدوي عند الحاجة
 */
export const manualClearLocalStorage = (
  keysToPreserve: string[] = ['theme', 'user-preferences']
) => {
  try {
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToPreserve.includes(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log(
      `[LocalStorage] تم حذف ${keysToDelete.length} عناصر يدويًا من localStorage`
    );
    return true;
  } catch (error) {
    console.error('[LocalStorage] خطأ أثناء التنظيف اليدوي:', error);
    return false;
  }
};

/**
 * دالة للحصول على حالة localStorage الحالية (للتصحيح)
 */
export const getLocalStorageDebugInfo = () => {
  const items: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      items[key] = localStorage.getItem(key) || '';
    }
  }
  return {
    totalItems: localStorage.length,
    items,
  };
};
