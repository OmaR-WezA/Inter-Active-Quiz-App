'use client';

import { LocalStorageManager } from '@/components/LocalStorageManager';

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* مكون تنظيف localStorage التلقائي */}
      <LocalStorageManager />

      {/* محتوى التطبيق الرئيسي */}
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-4">تطبيق الامتحانات التفاعلي</h1>
        <p className="text-lg text-muted-foreground mb-6">
          ✅ تم تفعيل تنظيف localStorage تلقائياً كل 15 دقيقة
        </p>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">المميزات:</h2>
          <ul className="space-y-2 text-foreground">
            <li>✓ تنظيف تلقائي لبيانات الامتحانات كل 15 دقيقة</li>
            <li>✓ منع تضارب البيانات عند فتح عدة امتحانات</li>
            <li>✓ حفظ البيانات المهمة (المظهر والتفضيلات)</li>
            <li>✓ يعمل بشكل تلقائي بدون تدخل من المستخدم</li>
          </ul>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 ملاحظة تقنية:
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            إذا أردت رؤية تفاصيل عملية التنظيف، افتح Developer Tools (F12) وانظر لـ Console
          </p>
        </div>
      </div>
    </main>
  );
}
