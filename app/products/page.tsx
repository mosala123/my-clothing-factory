// app/products/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { formatCurrency, getCategoryLabel, categories } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

// مكون بطاقة المنتج
const ProductCard = ({ product }: { product: any }) => (
  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
    <div className="relative h-72 overflow-hidden">
      <img
        src={product.hero_image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {product.badge && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary-dark text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          {product.badge}
        </span>
      )}
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          {getCategoryLabel(product.category)}
        </span>
        <span className="text-lg font-bold text-primary">
          {formatCurrency(product.price)}
        </span>
      </div>
      <h3 className="text-xl font-bold text-secondary mb-2 line-clamp-1">
        {product.name}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {product.summary}
      </p>
      <Link
        href={`/products/${product.slug}`}
        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        عرض التفاصيل
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
);

export default function ProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // جلب المنتجات من Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  // فلترة وترتيب المنتجات
  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      const searchMatch = !search.trim() ||
        product.name.includes(search) ||
        product.summary.includes(search) ||
        product.description?.includes(search) ||
        product.tags?.some((tag: string) => tag.includes(search));
      return categoryMatch && searchMatch;
    });

    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, activeCategory, search, sortBy]);

  // إحصائيات المنتجات حسب الفئة
  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = products.filter(p => p.category === cat.id).length;
      }
    });
    return counts;
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20 overflow-hidden">
        <div className="container-custom mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
              👕 كتالوج المنتجات
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-4">
              تشكيلة جاهزة للتخصيص أو التوريد المباشر
            </h1>
            <p className="text-gray-600 text-lg">
              استعرض الفئات المختلفة وابحث عن الموديل الأنسب لبراندك أو شركتك
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 sticky top-20 bg-white/95 backdrop-blur-md z-20 border-b border-gray-200">
        <div className="container-custom mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full lg:w-96 relative">
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن منتج أو خامة أو فئة..."
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
                <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.label}
                <span className={`mr-2 text-xs ${
                  activeCategory === category.id ? "text-white/80" : "text-gray-400"
                }`}>
                  ({categoryCount[category.id] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-custom mx-auto">
          {filteredAndSorted.length > 0 ? (
            <>
              <div className="mb-8 text-center">
                <p className="text-gray-500">
                  عرض <span className="font-bold text-primary">{filteredAndSorted.length}</span> منتج
                  {search && ` لـ "${search}"`}
                  {activeCategory !== "all" && ` في قسم ${getCategoryLabel(activeCategory as any)}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSorted.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">
                {search ? `لا توجد نتائج لـ "${search}"` : "لم يتم إضافة منتجات بعد"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-4">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            يمكننا تصنيع أي تصميم حسب طلبك الخاص. تواصل معنا للحصول على عرض سعر مخصص
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            اطلب عرض سعر مخصص
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}