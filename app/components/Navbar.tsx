// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCart } from "@/lib/cart";

// الروابط العامة (تظهر للكل)
const publicLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "عن المصنع" },
  { href: "/contact", label: "اتصل بنا" },
];

// روابط العميل (تظهر بعد تسجيل الدخول)
const customerLinks = [
  { href: "/orders", label: "طلباتي" },
];

// روابط الأدمن (تظهر للأدمن بس)
const adminLinks = [
  { href: "/dashboard", label: "لوحة التحكم" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // جلب حالة المستخدم
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // جلب صلاحية المستخدم
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        setUserRole(profile?.role || "customer");
      } else {
        setUser(null);
        setUserRole(null);
      }
    };
    
    getUser();
  }, [supabase]);

  // جلب عدد المنتجات في السلة
  useEffect(() => {
    const loadCartCount = async () => {
      const { items } = await getCart();
      setCartCount(items.length);
    };
    loadCartCount();
  }, []);

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    router.push("/");
  };

  // تحديد الروابط اللي تظهر حسب نوع المستخدم
  const getNavLinks = () => {
    let links = [...publicLinks];
    
    if (user) {
      // مستخدم مسجل دخول (عميل أو أدمن)
      links = [...links, ...customerLinks];
      
      if (userRole === "admin") {
        // أدمن
        links = [...links, ...adminLinks];
      }
    }
    
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-white text-xl font-black">م</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-black text-secondary">مصنع الإبداع</div>
              <div className="text-xs text-gray-500">تصنيع ملابس ويونيفورم بجودة ثابتة</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Cart Icon - يظهر للكل */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {!user ? (
              // غير مسجل دخول
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                >
                  دخول
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  إنشاء حساب
                </Link>
              </>
            ) : (
              // مسجل دخول
              <div className="flex items-center gap-3">
                {/* ترحيب بالاسم */}
                <div className="text-sm text-gray-600">
                  مرحباً، <span className="font-semibold text-primary">{user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 rounded-full border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-all duration-300"
                >
                  تسجيل خروج
                </button>
              </div>
            )}
            
            {/* زر عرض سعر - يظهر للكل */}
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              اطلب عرض سعر
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            aria-label="القائمة"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Cart Link for mobile */}
              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300"
              >
                <span>السلة</span>
                {cartCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
                {!user ? (
                  // غير مسجل دخول
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-3 rounded-xl border-2 border-gray-200 text-center font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      دخول
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-center font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                ) : (
                  // مسجل دخول
                  <>
                    <div className="px-4 py-2 text-center text-gray-600">
                      مرحباً، <span className="font-semibold text-primary">{user.email?.split("@")[0]}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-xl border-2 border-red-200 text-red-500 text-center font-semibold hover:bg-red-50 transition-all duration-300"
                    >
                      تسجيل خروج
                    </button>
                  </>
                )}
                <Link
                  href="/contact"
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-center font-semibold hover:shadow-lg transition-all duration-300"
                >
                  اطلب عرض سعر
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}