// app/orders/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoading(false); return; }
      setUser(user);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) toast.error("حدث خطأ في جلب الطلبات");
      else setOrders(data || []);
      setIsLoading(false);
    };
    fetchOrders();
  }, [supabase]);

  const statusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
    pending:   { color: "text-amber-700",  bg: "bg-amber-50  border-amber-200",  dot: "bg-amber-400",  label: "قيد المراجعة"    },
    approved:  { color: "text-green-700",  bg: "bg-green-50  border-green-200",  dot: "bg-green-500",  label: "تمت الموافقة"    },
    rejected:  { color: "text-red-700",    bg: "bg-red-50    border-red-200",    dot: "bg-red-400",    label: "مرفوض"           },
    completed: { color: "text-blue-700",   bg: "bg-blue-50   border-blue-200",   dot: "bg-blue-400",   label: "مكتمل"           },
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-2xl font-black">م</span>
          </div>
          <p className="text-gray-400 text-sm animate-pulse">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/4 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-sm mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">يجب تسجيل الدخول أولاً</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">لعرض طلباتك يجب أن تكون مسجلاً في الموقع</p>
          <div className="flex flex-col gap-3">
            <Link href="/login"
              className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-3 rounded-xl font-black text-sm hover:shadow-[0_8px_24px_rgba(196,122,58,0.35)] hover:-translate-y-0.5 transition-all duration-300 text-center">
              تسجيل الدخول
            </Link>
            <Link href="/signup"
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all text-center">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty orders ── */
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/4 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-lg mx-auto">

          {/* الأيقونة الرئيسية */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-14 h-14 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              {/* نجمة زخرفية */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-2 w-6 h-6 bg-primary/20 rounded-lg" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-3">لا توجد طلبات بعد!</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              لم تقم بأي طلب حتى الآن، تصفّح منتجاتنا واطلب ما تحتاجه بسهولة
            </p>
          </div>

          {/* خطوات سريعة */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">كيف تطلب؟</p>
            <div className="space-y-4">
              {[
                { num: "١", title: "تصفّح المنتجات",    desc: "اختر من مجموعتنا المتنوعة",         icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
                { num: "٢", title: "أرسل طلبك",          desc: "أدخل الكمية وتفاصيل طلبك",          icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
                { num: "٣", title: "تابع الحالة",         desc: "ستجد طلبك هنا فور إرساله",           icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((step) => (
                <div key={step.num} className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary/15 to-primary/25 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-primary font-black text-sm">{step.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* أزرار */}
          <div className="flex flex-col gap-3">
            <Link href="/products"
              className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-3.5 rounded-2xl font-black text-sm hover:shadow-[0_8px_24px_rgba(196,122,58,0.4)] hover:-translate-y-0.5 transition-all duration-300 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              تصفح المنتجات الآن
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/profile"
                className="bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-sm hover:border-primary/40 hover:text-primary transition-all text-center flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                حسابي
              </Link>
              <Link href="/"
                className="bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-sm hover:border-primary/40 hover:text-primary transition-all text-center flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                الرئيسية
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── Orders list ── */
  return (
    <div className="bg-gray-50 min-h-screen py-12" dir="rtl">
      <div className="container-custom mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-secondary">طلباتي</h1>
            <p className="text-gray-500 mt-1 text-sm">متابعة حالة طلباتك وتفاصيلها</p>
          </div>
          <Link href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-light to-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-[0_6px_20px_rgba(196,122,58,0.35)] hover:-translate-y-0.5 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            طلب جديد
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? { color: "text-gray-700", bg: "bg-gray-50 border-gray-200", dot: "bg-gray-400", label: order.status };
            const items  = order.items || [];

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">رقم الطلب</p>
                        <p className="font-mono text-sm font-black text-primary">{order.order_number}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200" />
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">تاريخ الطلب</p>
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(order.created_at).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.bg} ${status.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 truncate">{item.product_name}</h3>
                          <p className="text-sm text-gray-400">الكمية: {item.quantity} قطعة</p>
                        </div>
                        <p className="font-black text-primary shrink-0">
                          {(item.product_price * item.quantity).toLocaleString()} ج.م
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">إجمالي الطلب</span>
                    <span className="text-xl font-black text-primary">
                      {order.total_amount.toLocaleString()} ج.م
                    </span>
                  </div>

                  {order.notes && (
                    <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-xl px-3 py-2">
                      <span className="font-bold text-gray-600">ملاحظات: </span>{order.notes}
                    </p>
                  )}
                </div>

                <div className={`px-5 py-3 border-t ${status.bg}`}>
                  <p className={`text-xs text-center font-medium ${status.color}`}>
                    {order.status === "pending"   && "⏳ طلبك قيد المراجعة، سيتم التواصل معك قريباً"}
                    {order.status === "approved"  && "✅ تمت الموافقة على طلبك، جاري التجهيز"}
                    {order.status === "rejected"  && "❌ عذراً، لم نتمكن من قبول الطلب — للاستفسار تواصل معنا"}
                    {order.status === "completed" && "🎉 تم إكمال طلبك بنجاح، شكراً لثقتك بنا"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}