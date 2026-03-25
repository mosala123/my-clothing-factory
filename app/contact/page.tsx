// app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

// مكون بطاقة معلومات التواصل
const ContactInfoCard = ({ icon, title, content, link }: { icon: string; title: string; content: string; link?: string }) => (
  <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="text-lg font-bold text-secondary mb-2">{title}</h3>
    {link ? (
      <a href={link} className="text-gray-600 hover:text-primary transition-colors">
        {content}
      </a>
    ) : (
      <p className="text-gray-600">{content}</p>
    )}
  </div>
);

// مكون سؤال شائع
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-secondary">{question}</span>
        <svg
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // محاكاة إرسال البيانات
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const faqs = [
    {
      question: "كم تستغرق مدة تجهيز العينة؟",
      answer: "تتراوح مدة تجهيز العينة بين 3 إلى 7 أيام حسب تعقيد الموديل ونوع الخامة المطلوبة. نوفر خدمة العينة السريعة خلال 72 ساعة للموديلات البسيطة."
    },
    {
      question: "ما هي أقل كمية للطلب؟",
      answer: "نقبل الطلبات من 50 قطعة كحد أدنى، مع إمكانية تنفيذ كميات أقل للبراندات الناشئة حسب التفاهم المسبق. نوفر حلول مرنة تناسب جميع احتياجات العملاء."
    },
    {
      question: "هل تقومون بتطريز الشعارات؟",
      answer: "نعم، نوفر خدمة تطريز وطباعة الشعارات حسب الهوية البصرية للعميل، بأحدث التقنيات وبأعلى جودة."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع المقدم بنسبة 50%، والرصيد المتبقي قبل التسليم أو عند الاستلام حسب الاتفاق. نوفر خيارات دفع متعددة تناسب عملاءنا."
    },
    {
      question: "هل تقومون بالتوصيل خارج القاهرة؟",
      answer: "نعم، نوفر خدمة الشحن لجميع محافظات مصر وبعض الدول العربية حسب الاتفاق، مع متابعة دقيقة لضمان وصول الطلبات بأمان."
    },
    {
      question: "هل يمكن تعديل التصميم بعد العينة؟",
      answer: "نعم، نقبل تعديلات محدودة بعد العينة، ويتم احتساب أي تعديلات إضافية حسب الاتفاق. نحرص على تحقيق رضا العميل الكامل."
    }
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
              📞 تواصل معنا
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-secondary mb-6">
            قل لنا ما تحتاجه
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
            سواء كنت تريد عينة أولية أو إنتاج دفعة كاملة أو تجهيز يونيفورم، اترك
            تفاصيلك وسنتواصل معك خلال 24 ساعة عمل.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-12">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactInfoCard
              icon="📞"
              title="الهاتف"
              content="+20 100 123 4567"
              link="tel:+201001234567"
            />
            <ContactInfoCard
              icon="✉️"
              title="البريد الإلكتروني"
              content="hello@ibdaa-factory.com"
              link="mailto:hello@ibdaa-factory.com"
            />
            <ContactInfoCard
              icon="📍"
              title="العنوان"
              content="المحلة الكبرى، المنطقة الصناعية"
            />
            <ContactInfoCard
              icon="🕒"
              title="ساعات العمل"
              content="السبت إلى الخميس، 9 صباحًا - 6 مساءً"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in-up">
              {!isSubmitted ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary mb-2">أرسل طلبك</h2>
                    <p className="text-gray-500">سنرد عليك خلال يوم عمل واحد</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="أحمد محمد"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="example@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="+20 100 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نوع الطلب *
                      </label>
                      <select
                        name="requestType"
                        value={formData.requestType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                      >
                        <option value="" disabled>اختر نوع الطلب</option>
                        <option value="sample">عينة أولية</option>
                        <option value="wholesale">طلب جملة</option>
                        <option value="uniform">يونيفورم شركات</option>
                        <option value="custom">براند خاص</option>
                        <option value="general">استفسار عام</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الرسالة *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        placeholder="اكتب تفاصيل مشروعك أو المنتج المطلوب..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">
                        ⚠️ {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          جاري الإرسال...
                        </div>
                      ) : (
                        "إرسال الطلب"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-secondary mb-3">تم إرسال الطلب بنجاح</h2>
                  <p className="text-gray-500 mb-6">
                    شكرًا لتواصلك معنا. سنراجع التفاصيل ونتواصل معك خلال 24 ساعة عبر البريد الإلكتروني أو الهاتف.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        requestType: "",
                        message: ""
                      });
                    }}
                    className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-semibold"
                  >
                    إرسال طلب آخر
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Map & Info */}
            <div className="space-y-6 animate-fade-in-up delay-200">
              {/* Map */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-secondary font-semibold">المحلة الكبرى، المنطقة الصناعية</p>
                    <p className="text-gray-500 text-sm mt-2">جاهزون لاستقبال استفسارات التصنيع والعينات والتوريد</p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold">ساعات العمل</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>السبت - الخميس</span>
                    <span className="font-semibold">9:00 ص - 6:00 م</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>الجمعة</span>
                    <span>عطلة أسبوعية</span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gray-50 rounded-3xl p-8 text-center">
                <h3 className="font-bold text-secondary mb-2">دعم فني على مدار الساعة</h3>
                <p className="text-gray-500 text-sm mb-4">
                  للاستفسارات العاجلة، يمكنك التواصل معنا عبر الواتساب
                </p>
                <a
                  href="https://wa.me/201001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  واتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold text-sm mb-4">
              ❓ أسئلة شائعة
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-secondary mb-4">
              إجابات على أكثر الأسئلة تكرارًا
            </h2>
            <p className="text-gray-600">
              كل ما تريد معرفته عن خدماتنا وعملية التصنيع
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-4">
            هل لديك مشروع كبير؟
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            احصل على عرض سعر مخصص لاحتياجاتك الخاصة، فريقنا جاهز لمساعدتك
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            استعرض منتجاتنا
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}