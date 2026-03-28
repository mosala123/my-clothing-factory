// app/(admin)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { resolveUserRole, hasPermission, ROLE_LABELS, type UserRole } from "@/lib/auth-role";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// ─── أيقونات SVG ──────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  products: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  inventory: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  // أيقونة الجرس المحسنة
  bell: (
    <svg
      className="w-5 h-5 md:w-5 md:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  ),
  production: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

// ─── Badge للأرقام ─────────────────────────────────────────────────────────────
const NotifBadge = ({ count, active }: { count: number; active: boolean }) => {
  if (!count || count <= 0) return null;
  return (
    <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-black flex items-center justify-center tabular-nums leading-none transition-all ${active ? "bg-white text-primary shadow-sm" : "bg-red-500 text-white shadow-[0_2px_6px_rgba(239,68,68,0.5)]"
      }`}>
      {count > 99 ? "99+" : count}
    </span>
  );
};

// ─── Layout ────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("customer");
  const [adminName, setAdminName] = useState("مدير المصنع");
  const [showNotifications, setShowNotifications] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState({
    lowStockProducts: 0,
    outOfStockProducts: 0,
    criticalStockProducts: 0,
    totalNotifications: 0,
  });

  const notifRef = useRef<HTMLDivElement>(null);

  // ── جلب المنتجات لحساب المخزون ─────────────────────────────────────────────
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) {
      setProducts(data);
      const lowStock = data.filter(p => (p.quantity || 0) <= (p.min_stock || 10)).length;
      const outOfStock = data.filter(p => (p.quantity || 0) === 0).length;
      const criticalStock = data.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= (p.min_stock || 10) / 2).length;
      setNotifications({
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
        criticalStockProducts: criticalStock,
        totalNotifications: lowStock,
      });
    }
  };

  // ── إغلاق الـ dropdown لو ضغط برا ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── إغلاق الموبايل sidebar عند تغيير الصفحة ──────────────────────────────
  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  // ── التحقق من الصلاحيات ───────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .single();

      // تحقق من user_roles أولاً (للموظفين)
      const { data: userRoleData } = await supabase
        .from("user_roles")
        .select("role, name, is_active")
        .eq("user_id", user.id)
        .single();

      const resolvedRole = resolveUserRole(
        user.email,
        userRoleData?.role || profile?.role
      );

      // لو مش عنده صلاحية dashboard خالص
      if (!hasPermission(resolvedRole, "canViewDashboard")) {
        router.push("/login");
        return;
      }

      // لو الموظف مش active
      if (userRoleData && !userRoleData.is_active) {
        toast.error("حسابك موقوف، تواصل مع المدير");
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      setIsLoggedIn(true);
      setUserRole(resolvedRole);
      const name = userRoleData?.name || profile?.name;
      if (name) setAdminName(name);

      fetchProducts();
    };
    checkAuth();
  }, [router]);

  // تحديث الإشعارات كل 30 ثانية
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // المنتجات الناقصة (أعلى 3)
  const lowStockProductsList = useMemo(() => {
    return products
      .filter(p => (p.quantity || 0) <= (p.min_stock || 10))
      .sort((a, b) => ((a.quantity || 0) / (a.min_stock || 10)) - ((b.quantity || 0) / (b.min_stock || 10)))
      .slice(0, 3);
  }, [products]);

  // ── روابط الـ sidebar (حسب الصلاحيات) ────────────────────────────────────
  const allLinks = [
    {
      href: "/dashboard",
      label: "الرئيسية",
      icon: Icons.dashboard,
      badge: 0,
      permission: "canViewDashboard" as const,
    },
    {
      href: "/dashboard/inventory",
      label: "المخزون",
      icon: Icons.inventory,
      badge: notifications.lowStockProducts,
      permission: "canViewInventory" as const,
    },
    {
      href: "/dashboard/products",
      label: "المنتجات",
      icon: Icons.products,
      badge: 0,
      permission: "canViewProducts" as const,
    },
    {
      href: "/dashboard/production",
      label: "الإنتاج",
      icon: Icons.production,
      badge: 0,
      permission: "canViewProduction" as const,
    },
    {
      href: "/dashboard/users",
      label: "المستخدمين",
      icon: Icons.users,
      badge: 0,
      permission: "canEditSettings" as const, // admin فقط
    },
    {
      href: "/dashboard/settings",
      label: "الإعدادات",
      icon: Icons.settings,
      badge: 0,
      permission: "canViewSettings" as const,
    },
  ];

  // فلترة الروابط حسب صلاحية المستخدم
  const adminLinks = allLinks.filter(link =>
    hasPermission(userRole, link.permission)
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    toast.success("تم تسجيل الخروج");
    router.push("/login");
  };

  const currentLabel = adminLinks.find((l) => l.href === pathname)?.label || "الرئيسية";
  const initials = adminName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const roleLabel = ROLE_LABELS[userRole] || "مستخدم";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-2xl">م</span>
          </div>
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // ── مكوّن الـ Sidebar الداخلي ──────────────────────────────────────────────
  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center border-b border-white/8 ${collapsed ? "justify-center p-4" : "gap-3 px-5 py-4"}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md shrink-0">
          <span className="text-white font-black text-lg">م</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-black text-white text-sm leading-tight">مصنع الإبداع</p>
            <p className="text-white/40 text-xs">نظام إدارة المصنع</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          const hasBadge = link.badge > 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={`relative flex items-center rounded-xl transition-all duration-200 group ${collapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
                } ${isActive
                  ? "bg-white/12 text-white shadow-inner border border-white/10"
                  : "text-white/55 hover:text-white hover:bg-white/8"
                }`}
            >
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-light rounded-full" />
              )}
              <span className={`shrink-0 transition-transform duration-200 ${isActive ? "text-white" : "text-white/55 group-hover:text-white group-hover:scale-110"}`}>
                {link.icon}
              </span>
              {!collapsed && (
                <>
                  <span className={`flex-1 text-sm font-semibold ${isActive ? "text-white" : ""}`}>
                    {link.label}
                  </span>
                  {hasBadge && <NotifBadge count={link.badge} active={isActive} />}
                </>
              )}
              {collapsed && hasBadge && (
                <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-secondary-dark" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info + Logout */}
      <div className="p-3 border-t border-white/8 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0 shadow">
              <span className="text-white text-xs font-black">{initials}</span>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{adminName}</p>
              <p className="text-white/40 text-[10px]">{roleLabel}</p>
            </div>
            <span className="w-2 h-2 bg-green-400 rounded-full shrink-0 shadow-[0_0_6px_rgba(74,222,128,0.8)]" title="متصل" />
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "تسجيل الخروج" : undefined}
          className={`flex items-center w-full rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${collapsed ? "justify-center p-3" : "gap-3 px-3.5 py-2.5"
            }`}
        >
          <span className="shrink-0 group-hover:scale-110 transition-transform">{Icons.logout}</span>
          {!collapsed && <span className="text-sm font-semibold">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-muted, #f7f2eb)" }}>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col relative bg-gradient-to-b shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-[72px]"}`}
        style={{ background: "linear-gradient(180deg, var(--secondary) 0%, var(--secondary-dark) 100%)" }}
      >
        <SidebarContent collapsed={!isSidebarOpen} />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -left-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all z-20"
        >
          {isSidebarOpen ? Icons.chevronLeft : Icons.chevronRight}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-72 z-50 lg:hidden flex flex-col transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "linear-gradient(180deg, var(--secondary) 0%, var(--secondary-dark) 100%)" }}
      >
        <SidebarContent collapsed={false} />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 shadow-sm shrink-0 z-30">
          <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">

            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-secondary transition-colors">
                {Icons.menu}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm hidden sm:block">لوحة التحكم</span>
                {currentLabel !== "الرئيسية" && (
                  <>
                    <svg className="w-4 h-4 text-gray-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-black text-secondary">{currentLabel}</span>
                  </>
                )}
                {currentLabel === "الرئيسية" && (
                  <span className="text-sm font-black text-secondary sm:hidden">الرئيسية</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`
      relative p-2 rounded-xl transition-all duration-200 
      ${showNotifications
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:bg-gray-100 hover:text-secondary"
                    }
      focus:outline-none focus:ring-2 focus:ring-primary/20
    `}
                  aria-label="الإشعارات"
                >
                  {Icons.bell}
                  {notifications.totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center tabular-nums ring-2 ring-white shadow-sm">
                      {notifications.totalNotifications > 9 ? "9+" : notifications.totalNotifications}
                    </span>
                  )}
                </button>

                {/* Dropdown - تظهر أسفل الزر وتختفي عند الضغط برا */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-right"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-black text-secondary text-sm">تنبيهات المخزون</h3>
                        {notifications.totalNotifications > 0 && (
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full tabular-nums">
                            {notifications.totalNotifications} تنبيه
                          </span>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.lowStockProducts > 0 ? (
                          <>
                            <div className="px-4 py-2 bg-amber-50/50 sticky top-0">
                              <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                                <span>⚠️</span> منتجات تحتاج إعادة تصنيع
                              </p>
                            </div>
                            {lowStockProductsList.map((product, idx) => {
                              const quantity = product.quantity || 0;
                              const minStock = product.min_stock || 10;
                              const isOutOfStock = quantity === 0;
                              const isCritical = quantity > 0 && quantity <= minStock / 2;
                              return (
                                <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  <Link
                                    href="/dashboard/inventory"
                                    onClick={() => setShowNotifications(false)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50/60 transition-colors"
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOutOfStock || isCritical ? "bg-red-100" : "bg-amber-100"}`}>
                                      <span className={isOutOfStock ? "text-red-600" : "text-amber-600"}>
                                        {isOutOfStock ? "❌" : "⚠️"}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-gray-800 text-sm truncate">{product.name}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {isOutOfStock ? `غير متوفر (الحد الأدنى: ${minStock})` : `متوفر ${quantity} / ${minStock} قطعة`}
                                      </p>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${isOutOfStock ? "bg-red-500" : "bg-amber-500"}`} />
                                  </Link>
                                </motion.div>
                              );
                            })}
                            {notifications.lowStockProducts > 3 && (
                              <div className="px-4 py-2 text-center bg-gray-50">
                                <Link href="/dashboard/inventory" onClick={() => setShowNotifications(false)} className="text-xs text-primary font-semibold hover:underline">
                                  + {notifications.lowStockProducts - 3} منتج ناقص آخر
                                </Link>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                              <span className="text-2xl">✅</span>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">المخزون ممتاز</p>
                            <p className="text-gray-400 text-xs">لا توجد منتجات ناقصة حالياً</p>
                          </div>
                        )}
                      </div>

                      {notifications.totalNotifications > 0 && (
                        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-center">
                          <Link href="/dashboard/inventory" onClick={() => setShowNotifications(false)} className="text-primary text-xs font-bold hover:text-primary-dark transition-colors">
                            عرض جميع المنتجات الناقصة ←
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-7 bg-gray-200 hidden sm:block" />

              {/* Profile */}
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-secondary leading-tight">{adminName}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{roleLabel}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
