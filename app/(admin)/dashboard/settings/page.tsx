// app/(admin)/dashboard/settings/page.tsx
"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  // إعدادات عامة
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "مصنع الإبداع للملابس",
    siteDescription: "نصنع قطعًا جاهزة للبيع بشكل يليق ببراندك أو شركتك",
    siteEmail: "hello@ibdaa-factory.com",
    sitePhone: "+20 100 123 4567",
    siteAddress: "المحلة الكبرى، المنطقة الصناعية",
    workingHours: "السبت إلى الخميس، 9 صباحًا - 6 مساءً",
  });

  // إعدادات التواصل الاجتماعي
  const [socialSettings, setSocialSettings] = useState({
    facebook: "https://facebook.com/ibdaa-factory",
    instagram: "https://instagram.com/ibdaa-factory",
    twitter: "https://twitter.com/ibdaa-factory",
    whatsapp: "https://wa.me/201001234567",
  });

  // إعدادات الإشعارات
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewOrder: true,
    emailOnNewMessage: true,
    smsOnNewOrder: false,
    smsOnNewMessage: false,
  });

  // إعدادات المظهر
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#b87333",
    secondaryColor: "#2c3e50",
    logoUrl: "",
    faviconUrl: "",
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialSettings({
      ...socialSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // هنا هنضيف حفظ الإعدادات في Supabase بعدين
    console.log("حفظ الإعدادات:", {
      general: generalSettings,
      social: socialSettings,
      notifications: notificationSettings,
      appearance: appearanceSettings,
    });
    
    setTimeout(() => {
      setIsLoading(false);
      alert("تم حفظ الإعدادات بنجاح");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "عام", icon: "⚙️" },
    { id: "social", label: "التواصل الاجتماعي", icon: "🌐" },
    { id: "notifications", label: "الإشعارات", icon: "🔔" },
    { id: "appearance", label: "المظهر", icon: "🎨" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">إعدادات الموقع</h1>
        <p className="text-gray-500 mt-1">تخصيص إعدادات الموقع والمظهر والإشعارات</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-secondary">الإعدادات العامة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم الموقع
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="siteEmail"
                    value={generalSettings.siteEmail}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="sitePhone"
                    value={generalSettings.sitePhone}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="siteAddress"
                    value={generalSettings.siteAddress}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    وصف الموقع
                  </label>
                  <textarea
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    name="workingHours"
                    value={generalSettings.workingHours}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Settings Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-secondary">روابط التواصل الاجتماعي</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="ml-2">📘</span> فيسبوك
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={socialSettings.facebook}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="ml-2">📷</span> انستقرام
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={socialSettings.instagram}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="ml-2">🐦</span> تويتر
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={socialSettings.twitter}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="ml-2">💬</span> واتساب
                  </label>
                  <input
                    type="url"
                    name="whatsapp"
                    value={socialSettings.whatsapp}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="https://wa.me/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-secondary">إعدادات الإشعارات</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-secondary">إشعارات الطلبات الجديدة</h3>
                    <p className="text-sm text-gray-500">إرسال إشعار عند استلام طلب جديد</p>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="emailOnNewOrder"
                        checked={notificationSettings.emailOnNewOrder}
                        onChange={handleNotificationChange}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm">بريد إلكتروني</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="smsOnNewOrder"
                        checked={notificationSettings.smsOnNewOrder}
                        onChange={handleNotificationChange}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm">رسالة نصية</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-secondary">إشعارات الرسائل الجديدة</h3>
                    <p className="text-sm text-gray-500">إرسال إشعار عند استلام رسالة جديدة</p>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="emailOnNewMessage"
                        checked={notificationSettings.emailOnNewMessage}
                        onChange={handleNotificationChange}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm">بريد إلكتروني</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="smsOnNewMessage"
                        checked={notificationSettings.smsOnNewMessage}
                        onChange={handleNotificationChange}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm">رسالة نصية</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-secondary">إعدادات المظهر</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اللون الرئيسي
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      name="primaryColor"
                      value={appearanceSettings.primaryColor}
                      onChange={handleAppearanceChange}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={appearanceSettings.primaryColor}
                      onChange={handleAppearanceChange}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">اللون المستخدم في الأزرار والروابط الرئيسية</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اللون الثانوي
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={appearanceSettings.secondaryColor}
                      onChange={handleAppearanceChange}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      value={appearanceSettings.secondaryColor}
                      onChange={handleAppearanceChange}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">اللون المستخدم في العناوين والنصوص الرئيسية</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رابط الشعار (Logo)
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={appearanceSettings.logoUrl}
                    onChange={handleAppearanceChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                    placeholder="https://example.com/logo.png"
                  />
                  {appearanceSettings.logoUrl && (
                    <div className="mt-2">
                      <img src={appearanceSettings.logoUrl} alt="Logo" className="h-12 object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رابط الأيقونة (Favicon)
                  </label>
                  <input
                    type="url"
                    name="faviconUrl"
                    value={appearanceSettings.faviconUrl}
                    onChange={handleAppearanceChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">معاينة الألوان:</h3>
                <div className="flex gap-4">
                  <div
                    className="px-4 py-2 rounded-full text-white text-sm"
                    style={{ backgroundColor: appearanceSettings.primaryColor }}
                  >
                    لون رئيسي
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-white text-sm"
                    style={{ backgroundColor: appearanceSettings.secondaryColor }}
                  >
                    لون ثانوي
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                "حفظ الإعدادات"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}