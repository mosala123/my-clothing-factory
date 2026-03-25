// app/(admin)/dashboard/products/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "men",
    price: "",
    heroImage: "",
    gallery: [] as string[],
    summary: "",
    description: "",
    specs: [] as string[],
    tags: [] as string[],
    badge: "",
    inStock: true,
  });

  const [newSpec, setNewSpec] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // توليد slug من الاسم (إنجليزي فقط)
  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-") // تشيل كل الحروف الغير انجليزية والعربية
      .replace(/^-+|-+$/g, "")
      // تحويل الحروف العربية إلى إنجليزية
      .replace(/[^\x00-\x7F]/g, (char) => {
        const arabicToEnglish: Record<string, string> = {
          'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h',
          'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's',
          'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
          'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
          'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a'
        };
        return arabicToEnglish[char] || '-';
      })
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // التحقق من عدم تكرار slug
  const checkSlugUnique = async (slug: string): Promise<boolean> => {
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("slug", slug)
      .single();
    
    return !data;
  };

  // توليد slug فريد
  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;
    
    while (!(await checkSlugUnique(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // التحقق من البيانات المطلوبة
    if (!formData.name || !formData.price || !formData.heroImage) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      setIsLoading(false);
      return;
    }

    // توليد slug من الاسم
    let baseSlug = generateSlugFromName(formData.name);
    
    // إذا كان slug فارغ، استخدم "product" كقاعدة
    if (!baseSlug) {
      baseSlug = "product";
    }
    
    // التأكد من أن slug فريد
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // إضافة المنتج إلى Supabase
    const { error } = await supabase.from("products").insert({
      name: formData.name,
      slug: uniqueSlug,
      category: formData.category,
      price: parseInt(formData.price),
      hero_image: formData.heroImage,
      gallery: formData.gallery,
      summary: formData.summary,
      description: formData.description,
      specs: formData.specs,
      tags: formData.tags,
      badge: formData.badge || null,
      in_stock: formData.inStock,
    });

    if (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ في إضافة المنتج");
    } else {
      toast.success(`✅ تم إضافة المنتج بنجاح\nالرابط: /products/${uniqueSlug}`);
      router.push("/dashboard/products");
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">إضافة منتج جديد</h1>
          <p className="text-gray-500 mt-1">أدخل تفاصيل المنتج لإضافته إلى المتجر</p>
        </div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للمنتجات
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* العمود الأيمن */}
          <div className="space-y-6">
            {/* الاسم */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم المنتج *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                placeholder="مثال: قميص بولو كلاسيك"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                سيتم إنشاء رابط المنتج تلقائياً من الاسم
              </p>
            </div>

            {/* الفئة والسعر */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                >
                  <option value="men">رجالي</option>
                  <option value="women">حريمي</option>
                  <option value="kids">أطفال</option>
                  <option value="uniform">يونيفورم</option>
                </select>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  السعر (ج.م) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  placeholder="مثال: 350"
                  required
                />
              </div>
            </div>

            {/* الصورة الرئيسية */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصورة الرئيسية *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  name="heroImage"
                  value={formData.heroImage}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  placeholder="أو الصق رابط الصورة"
                />
                <label className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors">
                  📁 اختيار ملف
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, heroImage: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.heroImage && (
                <div className="mt-3">
                  <img
                    src={formData.heroImage}
                    alt="معاينة"
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* معرض الصور */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                معرض الصور
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  placeholder="أو الصق رابط صورة"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newImage.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        gallery: [...prev.gallery, newImage.trim()]
                      }));
                      setNewImage("");
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                  إضافة
                </button>
                <label className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors">
                  📁 رفع
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({
                            ...prev,
                            gallery: [...prev.gallery, reader.result as string]
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.gallery.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        gallery: prev.gallery.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* الشارة والحالة */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  شارة (Badge)
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  placeholder="مثال: الأكثر مبيعاً"
                />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-gray-700">متوفر في المخزون</span>
                </label>
              </div>
            </div>
          </div>

          {/* العمود الأيسر */}
          <div className="space-y-6">
            {/* الملخص */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ملخص المنتج *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
                placeholder="وصف قصير للمنتج يظهر في البطاقة"
                required
              />
            </div>

            {/* الوصف التفصيلي */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوصف التفصيلي *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none resize-none"
                placeholder="وصف مفصل للمنتج"
                required
              />
            </div>

            {/* المواصفات */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المواصفات
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (() => {
                    if (newSpec.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        specs: [...prev.specs, newSpec.trim()]
                      }));
                      setNewSpec("");
                    }
                  })()}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  placeholder="مثال: قطن 100%"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSpec.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        specs: [...prev.specs, newSpec.trim()]
                      }));
                      setNewSpec("");
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specs.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-sm"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        specs: prev.specs.filter((_, i) => i !== index)
                      }))}
                      className="text-gray-400 hover:text-red-500 mr-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* التاغات */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                التاغات
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (() => {
                    if (newTag.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        tags: [...prev.tags, newTag.trim()]
                      }));
                      setNewTag("");
                    }
                  })()}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  placeholder="مثال: صيفي"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTag.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        tags: [...prev.tags, newTag.trim()]
                      }));
                      setNewTag("");
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index)
                      }))}
                      className="text-primary/50 hover:text-red-500 mr-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-4 justify-end">
          <Link
            href="/dashboard/products"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري الإضافة...
              </div>
            ) : (
              "إضافة المنتج"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}