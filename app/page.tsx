// app/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { services } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

// ─── مكون بطاقة المنتج ────────────────────────────────────────────────────────
const ProductCard = ({ product }: { product: any }) => (
  <div className="product-card group">
    {/* الصورة */}
    <div className="relative h-64 overflow-hidden">
      <img
        src={product.hero_image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      />
      {/* Overlay تدريجي */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 right-3 bg-gradient-to-r from-primary to-primary-dark text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
          {product.badge}
        </span>
      )}

      {/* تصنيف الفئة */}
      <span className="absolute top-3 left-3 glass text-secondary text-xs font-bold px-3 py-1 rounded-full z-10">
        {product.category === "men"     && "رجالي"}
        {product.category === "women"   && "حريمي"}
        {product.category === "kids"    && "أطفال"}
        {product.category === "uniform" && "يونيفورم"}
      </span>
    </div>

    {/* المحتوى */}
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-black text-secondary line-clamp-1 flex-1 ml-2">
          {product.name}
        </h3>
        <span className="text-base font-black text-primary whitespace-nowrap">
          {product.price.toLocaleString()} ج.م
        </span>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
        {product.summary}
      </p>

      <Link
        href={`/products/${product.slug}`}
        className="flex items-center justify-between w-full bg-gradient-to-r from-primary-light to-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-[0_8px_24px_rgba(196,122,58,0.4)] hover:-translate-y-0.5 transition-all duration-300"
      >
        <span>عرض التفاصيل</span>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
);

// ─── مكون بطاقة الميزة ───────────────────────────────────────────────────────
const FeatureCard = ({
  icon, title, description,
}: {
  icon: string; title: string; description: string;
}) => (
  <div className="feature-card">
    <div className="icon-wrap relative z-10">{icon}</div>
    <h3 className="text-xl font-black text-secondary mb-2 relative z-10">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed relative z-10">{description}</p>
  </div>
);

// ─── مكون خطوة العمل ─────────────────────────────────────────────────────────
const ProcessStep = ({
  step, icon, title, description, isLast,
}: {
  step: number; icon: string; title: string; description: string; isLast: boolean;
}) => (
  <div className="flex flex-col items-center text-center relative">
    {/* الخط الرابط */}
    {!isLast && (
      <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-primary/40 to-primary/10 z-0" />
    )}
    {/* الدائرة */}
    <div className="relative z-10 mb-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_8px_24px_rgba(196,122,58,0.35)] mb-1">
        <span className="text-3xl">{icon}</span>
      </div>
      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-white text-xs font-black flex items-center justify-center shadow-md">
        {step}
      </span>
    </div>
    <h4 className="font-black text-secondary text-base mb-1">{title}</h4>
    <p className="text-gray-500 text-xs leading-relaxed max-w-[160px]">{description}</p>
  </div>
);

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function HomePage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, [supabase]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setTestimonials(data);
      setIsLoadingTestimonials(false);
    };
    fetchTestimonials();
  }, [supabase]);

  // ── البيانات الداخلية ───────────────────────────────────────────────────────

  const stats = [
    { value: "+10",  label: "سنوات خبرة",   icon: "🏭", desc: "خبرة متراكمة في التصنيع" },
    { value: "+500", label: "عميل مميز",    icon: "👥", desc: "عملاء وثقوا بنا" },
    { value: "+50K", label: "قطعة منتجة",  icon: "👕", desc: "تم تصنيعها بجودة عالية" },
    { value: "72h",  label: "تجهيز العينة", icon: "⏱️", desc: "أسرع وقت للعينة" },
  ];

  const features = [
    {
      icon: "🎯",
      title: "جودة ثابتة",
      description: "مراجعة مستمرة للخامات والتشطيب قبل كل دفعة تسليم لضمان أعلى مستويات الجودة.",
    },
    {
      icon: "⚡",
      title: "تجهيز سريع",
      description: "عينات خلال 72 ساعة وإنتاج مرن حسب الطلب مع الالتزام التام بالمواعيد.",
    },
    {
      icon: "🎨",
      title: "تخصيص كامل",
      description: "تطوير موديلات خاصة وتطريز شعارات حسب هويتك البصرية بأحدث التقنيات.",
    },
    {
      icon: "🚚",
      title: "توصيل لكل مصر",
      description: "شحن سريع وآمن لجميع محافظات مصر مع متابعة دقيقة لكل طلب.",
    },
  ];

  const processSteps = [
    { icon: "📞", title: "التواصل والاستشارة",  description: "بتبعتلنا فكرتك أو الموديل اللي عايزه" },
    { icon: "🎨", title: "تصميم العينة",         description: "بنجهزلك عينة أولية خلال 72 ساعة" },
    { icon: "✅", title: "الموافقة والتسعير",    description: "بتوافق على العينة ونحدد السعر والكمية" },
    { icon: "🏭", title: "الإنتاج",              description: "بندخل الإنتاج الكامل بجودة مضمونة" },
    { icon: "📦", title: "التغليف والتسليم",     description: "بنسلمك المنتج جاهز للبيع أو الاستخدام" },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
  ];

  const featuredProducts = products.slice(0, 4);
  const hasTestimonials  = testimonials.length > 0;

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* خلفية الهيرو */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/6 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* النص */}
            <div className="space-y-7 animate-fade-in-up">
              <div className="badge w-fit">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                حل تصنيع متكامل للملابس واليونيفورم
              </div>

              <h1 className="font-black leading-tight">
                نصنع قطعًا جاهزة للبيع
                <span className="block text-gradient mt-2">
                  بشكل يليق ببراندك أو شركتك
                </span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                من تطوير العينة الأولى حتى التغليف النهائي — نساعدك على إنتاج ملابس
                بجودة ثابتة وتشطيب مناسب للبيع أو الاستخدام المؤسسي.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="btn-primary text-base px-8 py-4 rounded-2xl"
                >
                  استعرض المنتجات
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary text-base px-8 py-4 rounded-2xl"
                >
                  تواصل معنا
                </Link>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: "⏱️", text: "عينات خلال 72 ساعة" },
                  { icon: "✅", text: "تشطيب ثابت للجملة والتجزئة" },
                  { icon: "🚚", text: "توصيل لجميع المحافظات" },
                ].map((pill) => (
                  <div
                    key={pill.text}
                    className="flex items-center gap-2 glass px-4 py-2 rounded-full shadow-xs border border-primary/10 text-sm font-semibold text-gray-700"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* الصورة */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"
                  alt="تصنيع ملابس"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                {/* بطاقة معلومات */}
                <div className="absolute bottom-5 right-5 left-5 glass rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-black text-primary">تشطيب منظم وتسليم واضح</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    مناسب للمتاجر، الزي الموحد، الطلبات الموسمية، والبراندات التي تحتاج شكل ثابت وإنتاج مرن.
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-primary/10 animate-float">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏭</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">خبرة</p>
                    <p className="text-sm font-black text-secondary">+10 سنوات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ TRUST BAR ══ */}
      <div className="bg-secondary py-5 overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              "✦ جودة مضمونة",
              "✦ أقل كمية 50 قطعة",
              "✦ تطريز وشعارات",
              "✦ دفع 50% مقدم",
              "✦ شحن لجميع المحافظات",
              "✦ استشارات مجانية",
            ].map((item) => (
              <span key={item} className="text-white/75 text-sm font-semibold whitespace-nowrap hover:text-primary-light transition-colors cursor-default">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════ STATS ══ */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-card animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-black text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-secondary">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FEATURES ══ */}
      <section className="py-20 bg-gray-50" style={{ background: "var(--bg-muted)" }}>
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge mx-auto mb-4">🎯 لماذا نحن؟</div>
            <h2 className="font-black text-secondary mb-2">
              نقدم لك أفضل خدمات التصنيع
            </h2>
            <div className="section-divider" />
            <p className="text-gray-500 mt-4">
              خبرة طويلة في تصنيع الملابس مع التزام صارم بمعايير الجودة في كل مرحلة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {features.map((f, i) => (
              <div key={f.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 90}ms` }}>
                <FeatureCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ PROCESS ══ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="badge mx-auto mb-4">🔄 كيف نشتغل؟</div>
            <h2 className="font-black text-secondary mb-2">
              خطوات واضحة من البداية للتسليم
            </h2>
            <div className="section-divider" />
            <p className="text-gray-500 mt-4">
              عملية شفافة وسلسة — بتعرف كل خطوة في طلبك
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-4">
            {processSteps.map((step, i) => (
              <ProcessStep
                key={step.title}
                step={i + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isLast={i === processSteps.length - 1}
              />
            ))}
          </div>

          {/* CTA صغير */}
          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary px-10 py-4 text-base rounded-2xl">
              ابدأ طلبك الآن
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ PRODUCTS ══ */}
      <section className="py-20" style={{ background: "var(--bg-muted)" }}>
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <div className="badge mb-3">👕 مختارات من الإنتاج</div>
              <h2 className="font-black text-secondary">
                منتجات جاهزة للعرض أو التخصيص
              </h2>
              <p className="text-gray-400 text-sm mt-1">تشكيلة مميزة من أحدث الموديلات</p>
            </div>
            <Link
              href="/products"
              className="btn-secondary px-6 py-3 rounded-xl text-sm"
            >
              كل المنتجات
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
              {featuredProducts.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 90}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════ GALLERY ══ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="badge mx-auto mb-4">📸 معرض أعمالنا</div>
            <h2 className="font-black text-secondary mb-2">نماذج من إنتاجنا</h2>
            <div className="section-divider" />
            <p className="text-gray-500 mt-4">
              أعمالنا تتكلم عن نفسها — جودة ودقة في كل تفصيلة
            </p>
          </div>

          {/* Grid غير متماثل */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl ${
                  i === 0 ? "md:col-span-2 aspect-[2/1]" : "aspect-square"
                }`}
              >
                <img
                  src={img}
                  alt={`منتج ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-107"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-400 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-bold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    من إنتاجنا
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ SERVICES + TESTIMONIALS ══ */}
      <section className="py-20" style={{ background: "var(--bg-muted)" }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* الخدمات */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/8">
              <div className="badge mb-4">🛠️ ماذا نقدم</div>
              <h2 className="text-2xl lg:text-3xl font-black text-secondary mb-6">
                خدمات من الفكرة حتى التسليم
              </h2>
              <div className="space-y-2.5">
                {services.map((service, i) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-primary/5 hover:border-primary/15 border border-transparent transition-all duration-300 group cursor-default"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <span className="text-primary font-black text-xs">{i + 1}</span>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm">{service}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all group"
                >
                  اطلب خدمة مخصصة
                  <svg className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* آراء العملاء */}
            {hasTestimonials ? (
              <div
                className="rounded-3xl p-8 text-white shadow-xl"
                style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)" }}
              >
                <div className="inline-flex items-center gap-2 bg-white/12 px-4 py-2 rounded-full text-white/90 font-bold text-sm mb-4">
                  💬 آراء العملاء
                </div>
                <h2 className="text-2xl lg:text-3xl font-black mb-6">
                  ما يقوله عملاؤنا
                </h2>
                <div className="space-y-4 max-h-[490px] overflow-y-auto custom-scrollbar">
                  {testimonials.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/10 rounded-2xl p-5 hover:bg-white/16 transition-all duration-300 border border-white/8"
                    >
                      {/* النجوم */}
                      <div className="flex items-center gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < (item.rating || 5) ? "text-yellow-400 fill-current" : "text-white/25"}`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-white/85 text-sm leading-relaxed mb-3">"{item.quote}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-primary-light text-sm">{item.name}</p>
                          {item.company && (
                            <p className="text-xs text-white/50 mt-0.5">{item.company}</p>
                          )}
                        </div>
                        <svg className="w-7 h-7 text-white/15 fill-current" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* لو مفيش آراء — بطاقة تشجيعية */
              <div
                className="rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center shadow-xl"
                style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)" }}
              >
                <div className="text-6xl mb-5">💬</div>
                <h3 className="text-2xl font-black mb-3">شارك تجربتك معنا</h3>
                <p className="text-white/70 mb-6 max-w-xs">
                  كن من أوائل العملاء الذين يشاركون رأيهم ويساعدون الآخرين في اتخاذ قرارهم
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-secondary px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
                >
                  تواصل معنا الآن
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ CTA ══ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-center"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}
          >
            {/* خلفية زخرفية */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/8 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full text-white font-semibold text-sm mb-6">
                🚀 جاهزين نبدأ معاك
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
                جاهز تبدأ مشروعك؟
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                تواصل معنا الآن للحصول على عرض سعر مخصص حسب الكمية والخامة وطبيعة الاستخدام
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-primary px-9 py-4 rounded-2xl font-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  اطلب عرض سعر الآن
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-9 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all duration-300"
                >
                  تصفح المنتجات
                </Link>
              </div>

              {/* ضمانات صغيرة */}
              <div className="flex flex-wrap justify-center gap-6 mt-10">
                {["✓ بدون التزامات", "✓ رد خلال 24 ساعة", "✓ استشارة مجانية"].map((item) => (
                  <span key={item} className="text-white/65 text-sm font-semibold">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}