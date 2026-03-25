// app/(admin)/dashboard/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function OrdersManagement() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // حالة الطلب بالعربية مع الألوان
  const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
    pending: { color: "bg-amber-100 text-amber-800", label: "قيد المراجعة", icon: "⏳" },
    approved: { color: "bg-green-100 text-green-800", label: "تمت الموافقة", icon: "✅" },
    rejected: { color: "bg-red-100 text-red-800", label: "مرفوض", icon: "❌" },
    completed: { color: "bg-blue-100 text-blue-800", label: "مكتمل", icon: "🎉" },
  };

  // جلب الطلبات
  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب الطلبات");
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // تحديث حالة الطلب
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("حدث خطأ في تحديث الحالة");
    } else {
      toast.success("تم تحديث حالة الطلب");
      fetchOrders();
    }
  };

  // حذف طلب
  const deleteOrder = async (orderId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        toast.error("حدث خطأ في حذف الطلب");
      } else {
        toast.success("تم حذف الطلب");
        fetchOrders();
      }
    }
  };

  // إحصائيات الطلبات
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  // فلترة الطلبات
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">إدارة الطلبات</h1>
        <p className="text-gray-500 mt-1">متابعة وتحديث حالة الطلبات الواردة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-primary">{stats.total}</div>
          <div className="text-xs text-gray-500">إجمالي الطلبات</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-amber-600">{stats.pending}</div>
          <div className="text-xs text-gray-500">قيد المراجعة</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-green-600">{stats.approved}</div>
          <div className="text-xs text-gray-500">تمت الموافقة</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-red-600">{stats.rejected}</div>
          <div className="text-xs text-gray-500">مرفوض</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-blue-600">{stats.completed}</div>
          <div className="text-xs text-gray-500">مكتمل</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="ابحث برقم الطلب، اسم العميل، أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "approved", "rejected", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filterStatus === status
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "الكل" : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-right">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">رقم الطلب</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">العميل</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">المنتجات</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الإجمالي</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">تاريخ الطلب</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || { color: "bg-gray-100 text-gray-800", label: order.status, icon: "📋" };
                const items = order.items || [];
                const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-primary font-semibold">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_email}</p>
                        {order.customer_phone && (
                          <p className="text-xs text-gray-500">{order.customer_phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {items.slice(0, 2).map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.product_name} × {item.quantity}
                          </p>
                        ))}
                        {items.length > 2 && (
                          <p className="text-xs text-gray-400">+{items.length - 2} منتجات أخرى</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">
                        {order.total_amount.toLocaleString()} ج.م
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 ${status.color} focus:outline-none cursor-pointer`}
                      >
                        <option value="pending">⏳ قيد المراجعة</option>
                        <option value="approved">✅ تمت الموافقة</option>
                        <option value="rejected">❌ مرفوض</option>
                        <option value="completed">🎉 مكتمل</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const itemsList = order.items.map((item: any) => 
                              `${item.product_name} (${item.quantity} قطعة)`
                            ).join("\n");
                            alert(`تفاصيل الطلب:\n\nالعميل: ${order.customer_name}\nالبريد: ${order.customer_email}\nالهاتف: ${order.customer_phone || "غير موجود"}\n\nالمنتجات:\n${itemsList}\n\nالإجمالي: ${order.total_amount.toLocaleString()} ج.م\n\nملاحظات: ${order.notes || "لا توجد"}`);
                          }}
                          className="p-2 text-gray-500 hover:text-primary transition-colors"
                          title="عرض التفاصيل"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لم يتم استلام أي طلبات بعد"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}