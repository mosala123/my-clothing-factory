// app/orders/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/site-data";
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
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setUser(user);
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        toast.error("حدث خطأ في جلب الطلبات");
      } else {
        setOrders(data || []);
      }
      setIsLoading(false);
    };
    
    fetchOrders();
  }, [supabase]);

  const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
    pending: { color: "bg-amber-100 text-amber-800", label: "قيد المراجعة", icon: "⏳" },
    approved: { color: "bg-green-100 text-green-800", label: "تمت الموافقة", icon: "✅" },
    rejected: { color: "bg-red-100 text-red-800", label: "مرفوض", icon: "❌" },
    completed: { color: "bg-blue-100 text-blue-800", label: "مكتمل", icon: "🎉" },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-custom mx-auto text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-3">يجب تسجيل الدخول</h1>
          <p className="text-gray-500 mb-6">للمتابعة يرجى تسجيل الدخول إلى حسابك</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-custom mx-auto text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-3">لا توجد طلبات</h1>
          <p className="text-gray-500 mb-6">لم تقم بإجراء أي طلبات بعد</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-secondary">طلباتي</h1>
          <p className="text-gray-500 mt-1">متابعة حالة طلباتك وتفاصيلها</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || { color: "bg-gray-100 text-gray-800", label: order.status, icon: "📋" };
            const items = order.items || [];
            
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">رقم الطلب</p>
                        <p className="font-mono text-sm font-bold text-primary">{order.order_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">تاريخ الطلب</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(order.created_at).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${status.color}`}>
                      {status.icon} {status.label}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary">{item.product_name}</h3>
                          <p className="text-sm text-gray-500">الكمية: {item.quantity} قطعة</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-500">السعر</p>
                          <p className="font-semibold text-primary">
                            {(item.product_price * item.quantity).toLocaleString()} ج.م
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">إجمالي الطلب</span>
                      <span className="text-xl font-bold text-primary">
                        {order.total_amount.toLocaleString()} ج.م
                      </span>
                    </div>
                    {order.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-semibold">ملاحظات:</span> {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3">
                  {order.status === "pending" && (
                    <p className="text-xs text-amber-600 text-center">⏳ طلبك قيد المراجعة، سيتم التواصل معك قريباً</p>
                  )}
                  {order.status === "approved" && (
                    <p className="text-xs text-green-600 text-center">✅ تمت الموافقة على طلبك، جاري التجهيز</p>
                  )}
                  {order.status === "rejected" && (
                    <p className="text-xs text-red-600 text-center">❌ عذراً، لم نتمكن من قبول الطلب. للاستفسار، تواصل معنا</p>
                  )}
                  {order.status === "completed" && (
                    <p className="text-xs text-blue-600 text-center">🎉 تم إكمال طلبك بنجاح. شكراً لثقتك بنا</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}