// app/terms/page.tsx
import Link from "next/link";

export default function TermsPage() {
  const lastUpdated = "1 يناير 2026";

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container-custom mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
            📜 الشروط والأحكام
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-4">
            شروط استخدام الموقع
          </h1>
          <p className="text-gray-500">
            آخر تحديث: {lastUpdated}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            {/* قبول الشروط */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">✅</span>
                قبول الشروط
              </h2>
              <p className="text-gray-600 leading-relaxed">
                باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام موقعنا. 
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطار المستخدمين بأي تغييرات جوهرية.
              </p>
            </section>

            {/* المنتجات والأسعار */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">🏷️</span>
                المنتجات والأسعار
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                الأسعار والمواصفات المعروضة داخل الموقع هي معلومات تعريفية أولية، وقد تختلف بحسب:
              </p>
              <ul className="space-y-2 mr-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">الكمية المطلوبة</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">نوع الخامة المختارة</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">طبيعة التخصيص المطلوب (تطريز، طباعة، إلخ)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">مواعيد التسليم المتفق عليها</span>
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                يتم اعتماد التفاصيل النهائية عند تأكيد العرض أو العينة الأولى.
              </p>
            </section>

            {/* الطلبات والعينات */}
            <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">🔍</span>
                الطلبات والعينات
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">1</span>
                  <p className="text-gray-600">نقوم بتجهيز عينة أولية للموافقة عليها قبل بدء الإنتاج الكامل</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">2</span>
                  <p className="text-gray-600">الموافقة على العينة تعني الموافقة على المواصفات النهائية للمنتج</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">3</span>
                  <p className="text-gray-600">يتم تحديد مواعيد التسليم بعد تأكيد الطلب والموافقة على العينة</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-bold">4</span>
                  <p className="text-gray-600">يحق للعميل طلب تعديلات على العينة خلال فترة محددة (عادة 3 أيام عمل)</p>
                </div>
              </div>
            </section>

            {/* التسليم والشحن */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">🚚</span>
                التسليم والشحن
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">⏱️ مواعيد التسليم</h3>
                  <p className="text-sm text-gray-500">يتم التسليم في المواعيد المتفق عليها حسب الكمية ونوع المنتج</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">💰 تكاليف الشحن</h3>
                  <p className="text-sm text-gray-500">تحسب حسب الموقع الجغرافي والكمية المطلوبة</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">📦 خيارات الشحن</h3>
                  <p className="text-sm text-gray-500">نوفر خيارات شحن متعددة تناسب احتياجات العميل</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">📍 التوصيل</h3>
                  <p className="text-sm text-gray-500">خدمة توصيل لجميع محافظات مصر وبعض الدول العربية</p>
                </div>
              </div>
            </section>

            {/* الدفع */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">💳</span>
                الدفع
              </h2>
              <ul className="space-y-3 mr-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">يتم تحديد شروط الدفع حسب نوع الطلب والكمية</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">عادةً ما يتم دفع نسبة مقدم (50%) عند بدء الإنتاج</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">يتم دفع الرصيد المتبقي قبل التسليم أو عند الاستلام حسب الاتفاق</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">نقبل التحويل البنكي والإيداع المباشر</span>
                </li>
              </ul>
            </section>

            {/* الضمانات والمرتجعات */}
            <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">🛡️</span>
                الضمانات والمرتجعات
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">نضمن جودة المنتجات حسب المواصفات المتفق عليها في العينة</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">في حالة وجود عيب تصنيعي، نقوم باستبدال المنتج فوراً</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-gray-600">لا نقبل استرجاع المنتجات بعد تصنيعها حسب الطلب (المنتجات المخصصة)</p>
                </div>
              </div>
            </section>

            {/* الملكية الفكرية */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">©️</span>
                الملكية الفكرية
              </h2>
              <p className="text-gray-600 leading-relaxed">
                جميع المحتويات المعروضة على هذا الموقع، بما في ذلك النصوص والصور والرسومات والشعارات، 
                محمية بحقوق الملكية الفكرية. يحظر نسخ أو إعادة استخدام أي محتوى دون إذن خطي مسبق من 
                إدارة مصنع الإبداع للملابس.
              </p>
            </section>

            {/* تعديل الشروط */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">✏️</span>
                تعديل الشروط
              </h2>
              <p className="text-gray-600 leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية 
                عبر البريد الإلكتروني أو من خلال إشعار على الموقع. استمرار استخدام الموقع بعد التعديلات 
                يعني موافقتك على الشروط المعدلة.
              </p>
            </section>

            {/* القانون المعمول به */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">⚖️</span>
                القانون المعمول به
              </h2>
              <p className="text-gray-600 leading-relaxed">
                تخضع هذه الشروط للقوانين المصرية، وأي نزاع ينشأ عن استخدام هذا الموقع يخضع 
                للاختصاص القضائي للمحاكم المصرية. نلتزم بحل أي نزاعات وديًا قبل اللجوء إلى الإجراءات القانونية.
              </p>
            </section>

            {/* تواصل معنا */}
            <section className="bg-primary/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">📞</span>
                تواصل معنا
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                لأي استفسار حول هذه الشروط، يرجى التواصل معنا عبر:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:legal@ibdaa-factory.com"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  legal@ibdaa-factory.com
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