// lib/cart.ts
import { createClient } from "@/lib/supabase/client";

// إضافة منتج للسلة
export async function addToCart(product: any, quantity: number = 1) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "يجب تسجيل الدخول أولاً" };
  }

  // التحقق إذا كان المنتج موجود بالفعل في السلة
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .maybeSingle();

  if (existing) {
    // تحديث الكمية
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    
    if (error) return { error };
    return { success: true, message: "تم تحديث الكمية" };
  } else {
    // إضافة منتج جديد
    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.hero_image || product.heroImage,
        quantity: quantity,
      });
    
    if (error) return { error };
    return { success: true, message: "تم إضافة المنتج للسلة" };
  }
}

// جلب محتويات السلة
export async function getCart() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { items: [], total: 0 };
  
  const { data: items } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id);
  
  const total = items?.reduce((sum, item) => sum + (item.product_price * item.quantity), 0) || 0;
  
  return { items: items || [], total };
}

// تحديث كمية منتج في السلة
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);
  
  if (error) return { error };
  return { success: true };
}

// حذف منتج من السلة
export async function removeFromCart(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);
  
  if (error) return { error };
  return { success: true };
}

// تفريغ السلة بالكامل
export async function clearCart() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;
  
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);
}

// تقديم الطلب
export async function submitOrder(customerInfo: {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };
  
  // جلب محتويات السلة
  const { items, total } = await getCart();
  
  if (items.length === 0) {
    return { error: "السلة فارغة" };
  }
  
  // إنشاء رقم طلب فريد
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // تحويل items إلى JSON صالح للتخزين
  const itemsForStorage = items.map(item => ({
    product_id: item.product_id,
    product_name: item.product_name,
    product_price: item.product_price,
    product_image: item.product_image,
    quantity: item.quantity,
  }));
  
  // حفظ الطلب
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      status: "pending",
      total_amount: total,
      items: itemsForStorage,
      notes: customerInfo.notes || null,
    })
    .select()
    .single();
  
  if (error) {
    console.error("Supabase error:", error);
    return { error: error.message || "حدث خطأ في حفظ الطلب" };
  }
  
  // تفريغ السلة
  await clearCart();
  
  return { success: true, order };
}