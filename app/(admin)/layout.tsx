// app/(admin)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("مدير النظام");
  
  // إحصائيات للإشعارات
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    newMessages: 0,
    totalNotifications: 0,
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // التحقق من تسجيل الدخول وجلب بيانات الأدمن
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      // جلب صلاحية المستخدم
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .single();
      
      if (profile?.role !== "admin") {
        router.push("/");
        return;
      }
      
      setIsLoggedIn(true);
      setIsAdmin(true);
      if (profile?.name) setAdminName(profile.name);
    };
    
    checkAuth();
  }, [router, supabase]);

  // جلب الإشعارات
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchNotifications = async () => {
      // جلب الطلبات pending
      const { data: pendingOrders, count: pendingCount } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .eq("status", "pending");
      
      // جلب الرسائل الجديدة
      const { data: newMessages, count: messagesCount } = await supabase
        .from("contacts")
        .select("*", { count: "exact" })
        .eq("status", "new");
      
      setNotifications({
        pendingOrders: pendingCount || 0,
        newMessages: messagesCount || 0,
        totalNotifications: (pendingCount || 0) + (messagesCount || 0),
      });
    };
    
    fetchNotifications();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, supabase]);

  // قائمة الروابط في لوحة التحكم مع عدد الإشعارات
  const adminLinks = [
    { href: "/dashboard", label: "الرئيسية", icon: "📊", badge: null },
    { href: "/dashboard/orders", label: "الطلبات", icon: "📦", badge: notifications.pendingOrders },
    { href: "/dashboard/products", label: "المنتجات", icon: "👕", badge: null },
    { href: "/dashboard/messages", label: "الرسائل", icon: "💬", badge: notifications.newMessages },
    { href: "/dashboard/clients", label: "العملاء", icon: "👥", badge: null },
    { href: "/dashboard/settings", label: "الإعدادات", icon: "⚙️", badge: null },
  ];

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - القائمة الجانبية */}
      <aside
        className={`bg-gradient-to-b from-secondary to-secondary-dark text-white transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-black">م</span>
              </div>
              <div>
                <div className="font-bold">مصنع الإبداع</div>
                <div className="text-xs text-gray-400">لوحة التحكم</div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-black">م</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            const hasBadge = link.badge && link.badge > 0;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{link.icon}</span>
                  {isSidebarOpen && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </div>
                {hasBadge && isSidebarOpen && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-white text-primary" : "bg-red-500 text-white"
                  }`}>
                    {link.badge}
                  </span>
                )}
                {hasBadge && !isSidebarOpen && (
                  <span className="absolute right-2 top-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="font-medium">تسجيل خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg md:text-xl font-bold text-secondary">
                {adminLinks.find((l) => l.href === pathname)?.label || "لوحة التحكم"}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications.totalNotifications > 9 ? "9+" : notifications.totalNotifications}
                    </span>
                  )}
                </button>
                
                {/* Dropdown Notifications */}
                {showNotifications && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in-up">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-bold text-secondary">الإشعارات</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.pendingOrders > 0 && (
                        <Link
                          href="/dashboard/orders"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-amber-600">📦</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">
                              طلبات جديدة
                            </p>
                            <p className="text-xs text-gray-500">
                              يوجد {notifications.pendingOrders} طلب بانتظار المراجعة
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">جديد</span>
                        </Link>
                      )}
                      
                      {notifications.newMessages > 0 && (
                        <Link
                          href="/dashboard/messages"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600">💬</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">
                              رسائل جديدة
                            </p>
                            <p className="text-xs text-gray-500">
                              يوجد {notifications.newMessages} رسالة غير مقروءة
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">جديد</span>
                        </Link>
                      )}
                      
                      {notifications.totalNotifications === 0 && (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-2">🔔</div>
                          <p className="text-gray-500 text-sm">لا توجد إشعارات جديدة</p>
                        </div>
                      )}
                    </div>
                    {notifications.totalNotifications > 0 && (
                      <div className="p-3 border-t border-gray-100 text-center">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            router.push("/dashboard/orders");
                          }}
                          className="text-primary text-sm font-semibold hover:underline"
                        >
                          عرض الكل
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Admin Info */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-left">
                  <div className="text-xs md:text-sm font-semibold text-secondary">{adminName}</div>
                  <div className="text-[10px] md:text-xs text-gray-500">مدير النظام</div>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}