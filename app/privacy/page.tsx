// app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  const lastUpdated = "1 يناير 2026";

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container-custom mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
            🔒 الخصوصية والأمان
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-gray-500">
            آخر تحديث: {lastUpdated}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            {/* مقدمة */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">📖</span>
                مقدمة
              </h2>
              <p className="text-gray-600 leading-relaxed">
                نحن في مصنع الإبداع للملابس نلتزم بحماية خصوصية بياناتك. توضح هذه السياسة كيفية 
                جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام موقعنا وخدماتنا. 
                نحرص على توفير بيئة آمنة وموثوقة لجميع عملائنا وشركائنا.
              </p>
            </section>

            {/* المعلومات التي نجمعها */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">📋</span>
                المعلومات التي نجمعها
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-secondary mb-2">معلومات الاتصال</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                    <li>الاسم الكامل</li>
                    <li>البريد الإلكتروني</li>
                    <li>رقم الهاتف</li>
                    <li>العنوان (عند الحاجة للتوصيل)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-secondary mb-2">معلومات الطلب</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                    <li>المنتجات المطلوبة</li>
                    <li>الكميات والمواصفات</li>
                    <li>تفاصيل التخصيص والتعديلات</li>
                    <li>سجل الطلبات السابقة</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-secondary mb-2">بيانات الاستخدام</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                    <li>كيفية تفاعلك مع موقعنا</li>
                    <li>الصفحات التي تزورها</li>
                    <li>مدة الزيارة</li>
                    <li>نوع الجهاز والمتصفح</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* كيف نستخدم معلوماتك */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">⚙️</span>
                كيف نستخدم معلوماتك
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                  <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-secondary">الرد على الاستفسارات</h3>
                    <p className="text-sm text-gray-500">تقديم عروض الأسعار والإجابة على أسئلتك</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                  <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-secondary">معالجة الطلبات</h3>
                    <p className="text-sm text-gray-500">تجهيز المنتجات ومتابعة عملية التصنيع</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                  <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-secondary">تحسين الخدمات</h3>
                    <p className="text-sm text-gray-500">تطوير تجربة المستخدم وجودة المنتجات</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                  <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-secondary">إشعارات محدثة</h3>
                    <p className="text-sm text-gray-500">إرسال تحديثات حول طلباتك وعروضنا</p>
                  </div>
                </div>
              </div>
            </section>

            {/* مشاركة المعلومات */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">🔄</span>
                مشاركة المعلومات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف خارجية إلا في الحالات التالية:
              </p>
              <ul className="space-y-2 mr-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">عند الضرورة لتقديم خدمة طلبتها (مثل شركات الشحن)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">عندما يطلب منا القانون ذلك</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">بموافقتك الصريحة</span>
                </li>
              </ul>
            </section>

            {/* حماية البيانات */}
            <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">🛡️</span>
                حماية بياناتك
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نستخدم إجراءات أمنية تقنية وإدارية متطورة لحماية معلوماتك من الوصول غير المصرح به 
                أو التعديل أو الإفصاح أو التدمير، وتشمل هذه الإجراءات:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  تشفير البيانات
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  جدران حماية
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  مراقبة مستمرة
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  نسخ احتياطية
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  تقييم المخاطر
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  تدريب الموظفين
                </div>
              </div>
            </section>

            {/* حقوقك */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">⚖️</span>
                حقوقك
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">🔍 الحق في الاطلاع</h3>
                  <p className="text-sm text-gray-500">يمكنك طلب نسخة من بياناتك الشخصية المخزنة لدينا</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">✏️ الحق في التصحيح</h3>
                  <p className="text-sm text-gray-500">يمكنك طلب تصحيح أي معلومات غير دقيقة</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">🗑️ الحق في الحذف</h3>
                  <p className="text-sm text-gray-500">يمكنك طلب حذف بياناتك الشخصية</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">🚫 حق الاعتراض</h3>
                  <p className="text-sm text-gray-500">يمكنك الاعتراض على معالجة بياناتك لأغراض التسويق</p>
                </div>
              </div>
            </section>

            {/* تحديثات السياسة */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">📅</span>
                تحديثات السياسة
              </h2>
              <p className="text-gray-600 leading-relaxed">
                قد نقوم بتحديث سياسة الخصوصية من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب 
                تشغيلية أو قانونية. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ المراجعة. 
                ننصحك بمراجعة هذه الصفحة بشكل دوري للاطلاع على أحدث التحديثات.
              </p>
            </section>

            {/* تواصل معنا */}
            <section className="bg-primary/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">📞</span>
                تواصل معنا
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، أو ترغب في ممارسة حقوقك، 
                يرجى التواصل معنا عبر:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:privacy@ibdaa-factory.com"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  privacy@ibdaa-factory.com
                </a>
                <a
                  href="tel:+201001234567"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +20 100 123 4567
                </a>
              </div>
            </section>
          </div>

          {/* Back Link */}
          <div className="border-t border-gray-100 px-8 md:px-12 py-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              العودة إلى الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}