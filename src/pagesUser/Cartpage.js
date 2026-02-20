import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Tag } from "lucide-react"; // أضفت Tag للأيقونات

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const cartFetch = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/cart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        
        // --- تعديل الحساب هنا ليستخدم final_price (السعر بعد الخصم) ---
        const calculatedTotal = data.data.reduce((acc, item) => {
          const priceToUse = item.product.final_price || item.product.price; // يستخدم السعر بعد الخصم لو موجود
          return acc + (priceToUse * item.quantity);
        }, 0);
        setTotal(calculatedTotal);
        // -------------------------------------------------------
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cartFetch();
  }, []);

  const updateQuantity = async (item, newQty) => {
    if (newQty < 1) return;
    const res = await fetch(`http://127.0.0.1:8000/api/cart/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: newQty }),
    });
    await res.json();
    cartFetch();
  };

  const removeItem = async (item) => {
    const res = await fetch(`http://127.0.0.1:8000/api/cart/${item.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    await res.json();
    cartFetch();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-zinc-900/50 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl">
          <ShoppingBag size={80} className="mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl font-black mb-4">سلتك فارغة تماماً</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">يبدو أنك لم تختر أي منتجات بعد. تصفح مجموعتنا المميزة الآن!</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95">
            ابدأ التسوق الآن <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
          <ShoppingBag className="text-blue-500" size={36} />
          سلة المشتريات
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* --- قائمة المنتجات (يسار) --- */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="group relative flex flex-col sm:flex-row items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-[2rem] backdrop-blur-sm transition-all hover:border-blue-500/30">
                <div className="flex items-center gap-6 w-full">
                  {/* صورة المنتج */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10">
                    <img 
                      src={item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `http://127.0.0.1:8000/storage/${item.product.image}`) : "/placeholder.png"} 
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{item.product.name}</h3>
                    
                    {/* --- عرض السعر الجديد والنسبة هنا --- */}
                    <div className="flex items-center gap-3">
                      <p className="text-blue-500 font-black text-lg">
                        {item.product.final_price || item.product.price} ج.م
                      </p>
                      {item.product.final_price && item.product.final_price < item.product.price && (
                        <>
                          <p className="text-gray-500 line-through text-sm">{item.product.price} ج.م</p>
                          <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                            <Tag size={10} /> {item.product.discount_percentage} خصم
                          </span>
                        </>
                      )}
                    </div>
                    {/* ----------------------------------- */}
                  </div>
                </div>

                {/* التحكم في الكمية */}
                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
                    <button 
                      className="p-1 hover:text-blue-500 transition-colors" 
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      className="p-1 hover:text-blue-500 transition-colors" 
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <button 
                    className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    onClick={() => removeItem(item)}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- ملخص الحساب (يمين) --- */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-blue-500/20 backdrop-blur-xl sticky top-32">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <CreditCard size={24} className="text-blue-500" />
                ملخص الطلب
              </h3>
              
              <div className="space-y-4 mb-8 text-gray-400">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="text-white font-bold">{total} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>مصاريف الشحن</span>
                  <span className="text-emerald-500 font-bold tracking-tight text-xs bg-emerald-500/10 px-2 py-1 rounded">مجاني بمناسبة الافتتاح</span>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold text-white">الإجمالي النهائي</span>
                  <span className="text-3xl font-black text-blue-500">{total} ج.م</span>
                </div>
              </div>

              <button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]"
                onClick={() => navigate("/checkout")}
              >
                إتمام عملية الشراء
                <ArrowRight size={20} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 opacity-30 grayscale">
              
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;