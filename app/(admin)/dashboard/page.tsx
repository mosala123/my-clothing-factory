// app/(admin)/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    readyOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    // جلب المنتجات
    const { data: products } = await supabase
      .from("products")
      .select("*", { count: "exact" });

    // جلب الطلبات
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    // جلب الرسائل
    const { data: messages, count: messagesCount } = await supabase
      .from("contacts")
      .select("*", { count: "exact" });

    const { count: unreadCount } = await supabase
      .from("contacts")
      .select("*", { count: "exact" })
      .eq("status", "new");

    if (orders) {
      const pending = orders.filter((o) => o.status === "قيد التنفيذ").length;
      const ready = orders.filter((o) => o.status === "جاهز للشحن").length;
      const delivered = orders.filter((o) => o.status === "تم التسليم").length;

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        readyOrders: ready,
        deliveredOrders: delivered,
        totalProducts: products?.length || 0,
        totalMessages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
      });
      setRecentOrders(orders.slice(0, 5));
    }

    setIsLoading(false);
  };

  // حالة الطلب بالعربية مع الألوان
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      "قيد التنفيذ": { color: "bg-amber-100 text-amber-800", label: "قيد التنفيذ" },
      "جاهز للشحن": { color: "bg-sky-100 text-sky-800", label: "جاهز للشحن" },
      "تم التسليم": { color: "bg-emerald-100 text-emerald-800", label: "تم التسليم" },
      "ملغي": { color: "bg-red-100 text-red-800", label: "ملغي" },
    };
    return statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
  };

  // بطاقات الإحصائيات
  const statCards = [
    { title: "إجمالي الطلبات", value: stats.totalOrders, icon: "📦", color: "from-blue-500 to-blue-600" },
    { title: "قيد التنفيذ", value: stats.pendingOrders, icon: "⚙️", color: "from-amber-500 to-amber-600" },
    { title: "جاهز للشحن", value: stats.readyOrders, icon: "🚚", color: "from-sky-500 to-sky-600" },
    { title: "تم التسليم", value: stats.deliveredOrders, icon: "✅", color: "from-emerald-500 to-emerald-600" },
    { title: "المنتجات", value: stats.totalProducts, icon: "👕", color: "from-primary to-primary-dark" },
    { title: "الرسائل", value: stats.totalMessages, icon: "💬", color: "from-purple-500 to-purple-600" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">مرحباً بك في لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على نشاط المتجر وإحصائياته</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{card.icon}</span>
              <span className="text-2xl font-black">{card.value}</span>
            </div>
            <p className="text-sm text-white/80 mt-2">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/orders"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h3 className="font-bold text-secondary">متابعة الطلبات</h3>
            <p className="text-sm text-gray-500">عرض وإدارة الطلبات</p>
          </div>
        </Link>

        <Link
          href="/dashboard/products"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl">👕</span>
          </div>
          <div>
            <h3 className="font-bold text-secondary">إدارة المنتجات</h3>
            <p className="text-sm text-gray-500">إضافة وتعديل المنتجات</p>
          </div>
        </Link>

        <Link
          href="/dashboard/messages"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h3 className="font-bold text-secondary">الرسائل</h3>
            <p className="text-sm text-gray-500">
              {stats.unreadMessages > 0 ? `${stats.unreadMessages} رسائل غير مقروءة` : "لا توجد رسائل جديدة"}
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h3 className="font-bold text-secondary">الإعدادات</h3>
            <p className="text-sm text-gray-500">تخصيص الموقع والإعدادات</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-secondary">آخر الطلبات</h2>
          <Link
            href="/dashboard/orders"
            className="text-primary text-sm font-semibold hover:underline"
          >
            عرض الكل ←
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">رقم الطلب</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">العميل</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">المنتج</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">الكمية</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">الإجمالي</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">الحالة</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => {
                const status = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-primary font-semibold">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.product_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                      {order.total.toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}