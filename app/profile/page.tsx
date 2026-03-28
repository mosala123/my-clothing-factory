// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at: string;
  avatar_url?: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total?: number;
}

const statusMap: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:    { label: "قيد الانتظار",  color: "text-amber-700",  bg: "bg-amber-50  border-amber-200",  dot: "bg-amber-400"  },
  processing: { label: "جاري التنفيذ",  color: "text-blue-700",   bg: "bg-blue-50   border-blue-200",   dot: "bg-blue-400"   },
  completed:  { label: "مكتمل",         color: "text-green-700",  bg: "bg-green-50  border-green-200",  dot: "bg-green-500"  },
  cancelled:  { label: "ملغي",          color: "text-red-700",    bg: "bg-red-50    border-red-200",    dot: "bg-red-400"    },
};

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-primary to-primary-dark",
    "from-secondary to-secondary-dark",
    "from-amber-400 to-orange-500",
    "from-teal-400 to-cyan-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials || "م"}
    </div>
  );
}

export default function ProfilePage() {
  const router   = useRouter();
  const supabase = createClient();

  const [profile,   setProfile]   = useState<Profile | null>(null);
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [editData,  setEditData]  = useState({ name: "", phone: "" });
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setIsLoading(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      router.push("/login");
      return;
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (prof) {
      setProfile({ ...prof, email: user.email ?? "" });
      setEditData({ name: prof.name ?? "", phone: prof.phone ?? "" });
    }

    // جلب الطلبات لو في جدول orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("id, created_at, status, total")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (ordersData) setOrders(ordersData);

    setIsLoading(false);
  }

  async function handleSave() {
    if (!profile) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ name: editData.name.trim(), phone: editData.phone.trim() })
      .eq("id", profile.id);

    if (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } else {
      setProfile((p) => p ? { ...p, name: editData.name, phone: editData.phone } : p);
      localStorage.setItem("userName", editData.name);
      toast.success("تم حفظ التغييرات ✓");
      setIsEditing(false);
    }
    setIsSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    toast.success("تم تسجيل الخروج");
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-2xl font-black">م</span>
          </div>
          <p className="text-gray-400 text-sm animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const joinDate = new Date(profile.created_at).toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric",
  });

  const tabs = [
    { id: "overview" as const, label: "نظرة عامة",  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "orders"   as const, label: "طلباتي",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "settings" as const, label: "الإعدادات",   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4" dir="rtl">
      {/* BG blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">

        {/* ── Header Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-secondary via-secondary-dark to-secondary relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          <div className="px-8 pb-7 mt-13">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4 -mt-10">
                <div className="ring-4 ring-white rounded-2xl shadow-xl">
                  <Avatar name={profile.name} size={80} />
                </div>
                <div className="mb-1">
                  <h1 className="text-xl font-black text-gray-900">{profile.name}</h1>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-gray-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  الرئيسية
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  تسجيل الخروج
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "إجمالي الطلبات",  value: orders.length.toString(),                                                         icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { label: "طلبات مكتملة",    value: orders.filter(o => o.status === "completed").length.toString(),                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "عضو منذ",          value: new Date(profile.created_at).getFullYear().toString(),                           icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary-light to-primary-dark text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "الاسم الكامل",       value: profile.name,                                      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              { label: "البريد الإلكتروني",  value: profile.email,                                     icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { label: "رقم الهاتف",          value: profile.phone || "غير محدد",                       icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              { label: "تاريخ الانضمام",      value: joinDate,                                           icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900">سجل الطلبات</h2>
              <p className="text-xs text-gray-400 mt-0.5">جميع طلباتك السابقة والحالية</p>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">لا توجد طلبات حتى الآن</p>
                <Link href="/" className="inline-block mt-4 text-xs text-primary font-bold hover:text-primary-dark transition-colors">
                  تصفح المنتجات ←
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const s = statusMap[order.status] ?? statusMap.pending;
                  const date = new Date(order.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric", month: "short", day: "numeric",
                  });
                  return (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">طلب #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-400">{date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.total != null && (
                          <span className="text-sm font-black text-gray-900">{order.total.toLocaleString()} ج.م</span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900">تعديل البيانات</h2>
                <p className="text-xs text-gray-400 mt-0.5">حدّث معلوماتك الشخصية</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل
                </button>
              ) : (
                <button
                  onClick={() => { setIsEditing(false); setEditData({ name: profile.name, phone: profile.phone ?? "" }); }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2"
                >
                  إلغاء
                </button>
              )}
            </div>

            <div className="px-6 py-6 space-y-5">
              {[
                { label: "الاسم الكامل",  field: "name"  as const, type: "text",  placeholder: "أدخل اسمك الكامل",    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { label: "رقم الهاتف",   field: "phone" as const, type: "tel",   placeholder: "01xxxxxxxxx",          icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              ].map((f) => (
                <div key={f.field} className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">{f.label}</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                      </svg>
                    </span>
                    <input
                      type={f.type}
                      value={editData[f.field]}
                      onChange={(e) => setEditData((d) => ({ ...d, [f.field]: e.target.value }))}
                      disabled={!isEditing}
                      className={`w-full pr-10 pl-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        isEditing
                          ? "bg-white border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          : "bg-gray-50 border-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                      placeholder={f.placeholder}
                    />
                  </div>
                </div>
              ))}

              {/* Email (readonly always) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 pr-1">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-3 rounded-xl font-black text-sm hover:shadow-[0_8px_24px_rgba(196,122,58,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      جاري الحفظ...
                    </span>
                  ) : "حفظ التغييرات"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}