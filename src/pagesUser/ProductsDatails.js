import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import addToCart from "../components/AddToCart";
import { ArrowRight, ShoppingCart, ShieldCheck, Truck, Star, Plus, Minus } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- تصحيح تعريف الحالات (States) ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://marisa-nonretired-willis.ngrok-free.dev/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          if (data.data.categories?.length > 0) {
            fetchRelated(data.data.categories[0].id);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchRelated = (categoryId) => {
    fetch(`https://marisa-nonretired-willis.ngrok-free.dev/api/categories/${categoryId}/products`, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.filter(p => p.id !== parseInt(id)).slice(0, 4);
        setRelatedProducts(filtered);
      });
  };

  const handleQuantity = (type) => {
    if (type === 'plus') setQuantity(prev => prev + 1);
    else if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500 font-bold">جاري التحميل...</div>;
  if (!product) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">المنتج غير موجود.</div>;

  // --- حساب السعر النهائي ---
  const hasDiscount = product.discount_price > 0;
  const finalPrice = hasDiscount ? product.price - product.discount_price : product.price;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans text-right" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-colors group text-sm font-bold">
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-2" /> العودة للمتجر
        </button>

        <div className="flex flex-col lg:flex-row-reverse gap-16 items-start mb-32">
          
          {/* الصورة */}
          <div className="w-full lg:w-1/2 sticky top-32">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl transition-transform hover:scale-[1.02] duration-700">
              <img src={product.image || "/placeholder.png"} className="w-full h-auto object-cover" alt={product.name} />
              {hasDiscount && (
                <div className="absolute top-6 right-6 bg-orange-500 text-black px-4 py-2 rounded-full text-xs font-black shadow-2xl">
                  خصم لفترة محدودة 🔥
                </div>
              )}
            </div>
          </div>

          {/* التفاصيل */}
          <div className="flex-1 w-full space-y-8">
            <div>
              <div className="flex items-center gap-1 mb-4 text-amber-500 justify-start">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-current" />)}
                <span className="text-gray-500 text-xs mr-2 font-bold">(120 تقييم)</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter mb-4">{product.name}</h1>
              
              {/* عرض السعر المطور */}
              <div className="flex items-end gap-4 mt-6">
                <span className="text-5xl font-black text-blue-500">{finalPrice} <span className="text-xl">ج.م</span></span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-600 line-through mb-1 decoration-red-500/50">{product.price} ج.م</span>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-sm font-bold">متوفر في المخزن ({product.stock})</span>
               </div>
               {hasDiscount && (
                 <span className="text-orange-500 text-xs font-black bg-orange-500/10 px-3 py-1 rounded-lg">وفرت {product.discount_price} ج.م</span>
               )}
            </div>

            <p className="text-gray-400 leading-relaxed text-lg italic border-r-4 border-blue-600 pr-6">{product.description}</p>

            {/* متحكم الكمية */}
            <div className="space-y-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">الكمية المطلوبة</span>
                <div className="flex items-center gap-6 bg-zinc-900 w-fit p-2 rounded-2xl border border-white/5">
                   <button onClick={() => handleQuantity('plus')} className="p-3 hover:bg-white/10 text-blue-500 rounded-xl transition-colors"><Plus size={18}/></button>
                   <span className="text-2xl font-black w-10 text-center">{quantity}</span>
                   <button onClick={() => handleQuantity('minus')} className="p-3 hover:bg-white/10 text-red-500 rounded-xl transition-colors"><Minus size={18}/></button>
                </div>
            </div>

            <button 
              onClick={() => addToCart(product.id, quantity)}
              className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 overflow-hidden relative"
            >
              <ShoppingCart size={24} className="group-hover:-translate-y-1 transition-transform" /> أضف إلى السلة
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/5">
                <div className="flex items-center gap-3"><Truck className="text-blue-500" /> <span className="text-xs font-bold text-gray-400">شحن آمن وسريع</span></div>
                <div className="flex items-center gap-3"><ShieldCheck className="text-blue-500" /> <span className="text-xs font-bold text-gray-400">ضمان استرجاع 14 يوم</span></div>
            </div>
          </div>
        </div>

        {/* يمكنك إضافة قسم المنتجات المشابهة هنا لاحقاً باستخدام relatedProducts */}
      </div>
    </div>
  );
};

export default ProductDetails;