// app/(admin)/dashboard/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

// نوع الطلب بالعربية
const requestTypeLabels: Record<string, string> = {
  sample: "عينة أولية",
  wholesale: "طلب جملة",
  uniform: "يونيفورم شركات",
  custom: "براند خاص",
  general: "استفسار عام",
};

// حالة الرسالة بالعربية والألوان
const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  new: { label: "جديد", color: "bg-blue-100 text-blue-800", icon: "🔵" },
  read: { label: "مقروء", color: "bg-gray-100 text-gray-600", icon: "📖" },
  replied: { label: "تم الرد", color: "bg-green-100 text-green-800", icon: "✅" },
};

export default function MessagesManagement() {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  // جلب الرسائل من Supabase
  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب الرسائل");
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // إحصائيات الرسائل
  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };

  // تحديث حالة الرسالة
  const updateMessageStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("contacts")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("حدث خطأ");
    } else {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    }
  };

  // حذف رسالة
  const deleteMessage = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("حدث خطأ");
      } else {
        toast.success("تم حذف الرسالة");
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    }
  };

  // إرسال رد (محاكاة - هنضيف إرسال إيميل بعدين)
  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("يرجى كتابة الرد قبل الإرسال");
      return;
    }
    
    // هنا هنضيف إرسال الرد عبر البريد الإلكتروني بعدين
    console.log(`إرسال رد إلى ${selectedMessage.email}:`, replyText);
    
    // تحديث حالة الرسالة إلى "تم الرد"
    await updateMessageStatus(selectedMessage.id, "replied");
    
    toast.success("تم إرسال الرد بنجاح");
    setReplyText("");
    setSelectedMessage(null);
  };

  // عرض تفاصيل الرسالة وتحديث حالتها إلى "مقروء"
  const openMessageDetails = async (message: any) => {
    setSelectedMessage(message);
    if (message.status === "new") {
      await updateMessageStatus(message.id, "read");
    }
  };

  // فلترة الرسائل
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      !searchTerm ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || message.status === filterStatus;
    const matchesType = filterType === "all" || message.request_type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary">الرسائل الواردة</h1>
        <p className="text-gray-500 mt-1">متابعة وإدارة رسائل العملاء</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-primary">{stats.total}</div>
          <div className="text-xs text-gray-500">إجمالي الرسائل</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-blue-600">{stats.new}</div>
          <div className="text-xs text-gray-500">جديد</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-gray-600">{stats.read}</div>
          <div className="text-xs text-gray-500">مقروء</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-black text-green-600">{stats.replied}</div>
          <div className="text-xs text-gray-500">تم الرد</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="ابحث بالاسم، البريد، أو محتوى الرسالة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
          >
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="read">مقروء</option>
            <option value="replied">تم الرد</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
          >
            <option value="all">كل الأنواع</option>
            <option value="sample">عينة أولية</option>
            <option value="wholesale">طلب جملة</option>
            <option value="uniform">يونيفورم</option>
            <option value="custom">براند خاص</option>
            <option value="general">استفسار عام</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredMessages.map((message) => {
            const status = statusConfig[message.status];
            return (
              <div
                key={message.id}
                onClick={() => openMessageDetails(message)}
                className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-secondary">{message.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{message.email}</p>
                <p className="text-xs text-primary mb-2">{requestTypeLabels[message.request_type]}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(message.created_at).toLocaleDateString("ar-EG")}
                </p>
              </div>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">لا توجد رسائل</p>
            </div>
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-secondary">{selectedMessage.name}</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-sm text-gray-500">{selectedMessage.email}</span>
                      {selectedMessage.phone && (
                        <span className="text-sm text-gray-500">{selectedMessage.phone}</span>
                      )}
                      <span className="text-sm text-primary">{requestTypeLabels[selectedMessage.request_type]}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="حذف"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">محتوى الرسالة:</h3>
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{selectedMessage.message}</p>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">الرد على الرسالة:</h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="اكتب ردك هنا..."
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleReply}
                      disabled={selectedMessage.status === "replied"}
                      className="px-6 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      إرسال الرد
                    </button>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                  {selectedMessage.status === "replied" && (
                    <p className="text-sm text-green-600 mt-3">✓ تم الرد على هذه الرسالة مسبقاً</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-secondary mb-2">لا توجد رسالة محددة</h3>
              <p className="text-gray-500 text-sm">اختر رسالة من القائمة لعرض التفاصيل والرد عليها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}