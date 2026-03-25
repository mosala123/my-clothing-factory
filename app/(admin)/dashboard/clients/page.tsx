// app/(admin)/dashboard/clients/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ClientsManagement() {
  const supabase = createClient();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  // جلب العملاء من Supabase
  const fetchClients = async () => {
    setIsLoading(true);
    
    // جلب جميع المستخدمين من جدول profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast.error("حدث خطأ في جلب العملاء");
      setIsLoading(false);
      return;
    }

    // جلب عدد الطلبات لكل عميل
    const clientsWithOrders = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: orders, count } = await supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("user_id", profile.id);

        const totalSpent = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

        return {
          ...profile,
          orders_count: count || 0,
          total_spent: totalSpent,
        };
      })
    );

    setClients(clientsWithOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // تغيير صلاحية المستخدم
  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      toast.error("حدث خطأ في تحديث الصلاحية");
    } else {
      toast.success(`تم تغيير صلاحية المستخدم إلى ${newRole === "admin" ? "أدمن" : "عميل"}`);
      fetchClients();
    }
    setEditingClient(null);
  };

  // حذف مستخدم
  const deleteUser = async (userId: string, userName: string) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) {
      // ملاحظة: حذف المستخدم من auth.users يتطلب إعدادات إضافية
      // حالياً بنحذف فقط من جدول profiles
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        toast.error("حدث خطأ في حذف المستخدم");
      } else {
        toast.success("تم حذف المستخدم");
        fetchClients();
      }
    }
  };

  // فلترة العملاء
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      !searchTerm ||
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // إحصائيات
  const stats = {
    total: clients.length,
    admins: clients.filter((c) => c.role === "admin").length,
    customers: clients.filter((c) => c.role === "customer").length,
    totalOrders: clients.reduce((sum, c) => sum + c.orders_count, 0),
    totalSpent: clients.reduce((sum, c) => sum + c.total_spent, 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل العملاء...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">إدارة العملاء</h1>
        <p className="text-gray-500 mt-1">متابعة وإدارة حسابات العملاء والصلاحيات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-primary">{stats.total}</div>
          <div className="text-xs text-gray-500">إجمالي العملاء</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-blue-600">{stats.customers}</div>
          <div className="text-xs text-gray-500">عملاء عاديين</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-purple-600">{stats.admins}</div>
          <div className="text-xs text-gray-500">مشرفين</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-emerald-600">{stats.totalOrders}</div>
          <div className="text-xs text-gray-500">إجمالي الطلبات</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
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
            placeholder="ابحث بالاسم، البريد، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-right">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الاسم</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">رقم الهاتف</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الطلبات</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">إجمالي المشتريات</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">تاريخ التسجيل</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الصلاحية</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">إجراءات</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {client.name?.charAt(0) || client.email?.charAt(0) || "?"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{client.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.phone || "—"}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">{client.orders_count}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                    {client.total_spent.toLocaleString()} ج.م
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(client.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4">
                    {editingClient === client.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-primary outline-none"
                        >
                          <option value="customer">عميل</option>
                          <option value="admin">أدمن</option>
                        </select>
                        <button
                          onClick={() => updateUserRole(client.id, newRole)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingClient(null)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${client.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                        {client.role === "admin" ? "أدمن" : "عميل"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {client.role !== "admin" && (
                        <button
                          onClick={() => {
                            setEditingClient(client.id);
                            setNewRole(client.role);
                          }}
                          className="p-2 text-gray-500 hover:text-primary transition-colors"
                          title="تعديل الصلاحية"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(client.id, client.name || client.email)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">لا يوجد عملاء</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لم يتم تسجيل أي عملاء بعد"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}