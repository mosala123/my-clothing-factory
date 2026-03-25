// app/about/page.tsx
import Link from "next/link";

// مكون بطاقة القيم
const ValueCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
      <span className="text-4xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// مكون نقطة زمنية
const TimelineItem = ({ year, title, description }: { year: string; title: string; description: string }) => (
  <div className="relative group">
    <div className="absolute right-0 top-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      <span className="text-primary font-bold">{year.slice(-2)}</span>
    </div>
    <div className="mr-16">
      <div className="text-primary font-bold text-lg mb-1">{year}</div>
      <h3 className="text-lg font-bold text-secondary mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function AboutPage() {
  // رؤية المصنع
  const vision = {
    title: "رؤيتنا",
    description: "أن نكون الشريك الأول في مجال تصنيع الملابس في الشرق الأوسط، من خلال تقديم منتجات مبتكرة بجودة عالمية تلبي احتياجات عملائنا وتتجاوز توقعاتهم."
  };

  // رسالة المصنع
  const mission = {
    title: "رسالتنا",
    description: "تقديم حلول تصنيع مرنة ومتكاملة تلبي احتياجات العملاء المختلفة، مع الالتزام بأعلى معايير الجودة والدقة في التنفيذ، والحرص على تطوير منتجاتنا باستمرار."
  };

  // قيم المصنع
  const values = [
    {
      icon: "⭐",
      title: "الجودة",
      description: "مراجعة ثابتة للخامات والتشطيب قبل أي دفعة تسليم لضمان أعلى مستويات الجودة."
    },
    {
      icon: "🎯",
      title: "الدقة",
      description: "تفاصيل المقاس والتعبئة والهوية البصرية محسوبة بوضوح لتحقيق التميز."
    },
    {
      icon: "🔄",
      title: "المرونة",
      description: "حلول تناسب الدفعات الصغيرة والمتوسطة والمشاريع المتنامية بكل احترافية."
    },
    {
      icon: "🤝",
      title: "الثقة",
      description: "علاقة طويلة الأمد مع متابعة واضحة في كل مرحلة تنفيذ حتى التسليم النهائي."
    },
    {
      icon: "💡",
      title: "الابتكار",
      description: "مواكبة أحدث صيحات الموضة والتقنيات في صناعة الملابس."
    },
    {
      icon: "🌍",
      title: "الاستدامة",
      description: "الالتزام بالممارسات الصديقة للبيئة في عمليات التصنيع."
    }
  ];

  // المحطات الزمنية
  const timeline = [
    {
      year: "2010",
      title: "بداية الرحلة",
      description: "بداية المصنع بخط إنتاج واحد مخصص للقمصان والطلبات الصغيرة، مع فريق عمل متخصص."
    },
    {
      year: "2015",
      title: "التوسع الأول",
      description: "توسع في إنتاج الملابس الحريمي والأطفال مع إضافة فريق تطوير عينات متخصص."
    },
    {
      year: "2018",
      title: "تطوير الجودة",
      description: "اعتماد نظام إدارة الجودة الشامل وتطوير خطوط الإنتاج بأحدث المعدات."
    },
    {
      year: "2020",
      title: "يونيفورم الشركات",
      description: "تجهيز مسار كامل ليونيفورم الشركات والمطاعم والفنادق بمعايير احترافية."
    },
    {
      year: "2023",
      title: "الرقمنة",
      description: "تطوير نظام إلكتروني متكامل لإدارة الطلبات والإنتاج."
    },
    {
      year: "2026",
      title: "منصة عرض رقمية",
      description: "إطلاق منصة عرض رقمية متطورة تساعد العملاء على تصفح المنتجات وطلب التجهيز بسهولة."
    }
  ];

  // إحصائيات
  const stats = [
    { value: "10+", label: "سنوات خبرة", icon: "🏭" },
    { value: "500+", label: "عميل مميز", icon: "👥" },
    { value: "50K+", label: "قطعة منتجة", icon: "👕" },
    { value: "24/7", label: "دعم فني", icon: "📞" },
    { value: "100%", label: "رضا العملاء", icon: "😊" },
    { value: "72h", label: "تجهيز العينة", icon: "⚡" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
              🏭 من نحن
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-6">
              مصنع الإبداع للملابس
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              شغلنا قائم على جودة واضحة وتسليم منظم، نركز على تنفيذ موديلات قابلة للبيع والتكرار،
              مع اهتمام بالتشطيب وثبات الخامة وسهولة التوريد للمتاجر والشركات.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👁️</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-4">{vision.title}</h2>
              <p className="text-gray-600 leading-relaxed">{vision.description}</p>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-4">{mission.title}</h2>
              <p className="text-gray-600 leading-relaxed">{mission.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center text-white animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
              💎 قيمنا
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-secondary mb-4">
              المبادئ التي نعمل بها
            </h2>
            <p className="text-gray-600 text-lg">
              مجموعة من القيم الراسخة التي توجه عملنا وتحدد علاقتنا مع عملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ValueCard {...value} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
              📅 رحلتنا
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-secondary mb-4">
              محطات مهمة في مسيرتنا
            </h2>
            <p className="text-gray-600 text-lg">
              10 سنوات من التميز والإبداع في صناعة الملابس
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {timeline.slice(0, 3).map((item, index) => (
                <TimelineItem key={item.year} {...item} />
              ))}
            </div>
            <div className="space-y-8">
              {timeline.slice(3, 6).map((item, index) => (
                <TimelineItem key={item.year} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
                🌟 لماذا نحن؟
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-secondary mb-6">
                لماذا يختار عملاؤنا مصنع الإبداع؟
              </h2>
              <div className="space-y-4">
                {[
                  "خبرة تمتد لأكثر من 10 سنوات في مجال تصنيع الملابس",
                  "فريق عمل متخصص في تطوير العينات والتصاميم المبتكرة",
                  "أحدث خطوط الإنتاج والتقنيات المتطورة في الصناعة",
                  "التزام بمواعيد التسليم وجودة المنتجات",
                  "أسعار تنافسية وحلول مرنة تناسب جميع الميزانيات",
                  "دعم فني ومتابعة مستمرة بعد التسليم"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
                  alt="مصنع الإبداع للملابس"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-lg font-bold">مصنع الإبداع للملابس</p>
                  <p className="text-sm text-white/80">منذ 2010</p>
                </div>
              </div>
              {/* ختم الجودة */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="text-white font-black text-2xl">10</div>
                  <div className="text-white text-xs">سنوات</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            نريد أن نكون شريكك الموثوق
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            لو عندك براند جديد أو طلب توريد قائم، نساعدك في العينة والتجهيز وخطة التسليم
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            تواصل معنا الآن
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}