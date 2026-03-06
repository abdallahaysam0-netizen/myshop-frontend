import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";
import Sidebar from "../../components/sidebar"; // افترضت وجوده لتناسق اللوحة

export default function ProductAdminDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-orange-500 text-2xl font-bold animate-pulse">جاري تحميل التفاصيل...</div>
      </div>
    );
  }

  if (!product) return <div className="text-white text-center py-20">المنتج غير موجود</div>;

  // حساب السعر النهائي (السعر الأصلي - مبلغ الخصم)
  const finalPrice = product.price - (product.discount_price || 0);

  return (
    <div className="flex bg-black min-h-screen text-zinc-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* Header & Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4" dir="rtl">
            <h1 className="text-4xl font-black text-white border-r-8 border-orange-500 pr-4">
              تفاصيل <span className="text-orange-500">المنتج</span>
            </h1>
            <div className="flex gap-3">
              <Link
                to={`/admin/products/edit/${product.id}`}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl transition-all border border-zinc-700"
              >
                تعديل البيانات
              </Link>
              <Link
                to="/admin/products"
                className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
              >
                العودة للقائمة
              </Link>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

            {/* Image Section */}
            <div className="relative h-[400px] lg:h-auto overflow-hidden bg-zinc-800">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700">لا توجد صورة</div>
              )}
              {product.discount_price > 0 && (
                <div className="absolute top-6 right-6 bg-orange-500 text-black font-black px-4 py-2 rounded-full shadow-2xl">
                  خصم فعال 🔥
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-12 text-right" dir="rtl">
              <div className="mb-6">
                <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">اسم المنتج</span>
                <h2 className="text-3xl font-bold text-white mt-1">{product.name}</h2>
              </div>

              {/* Pricing Block */}
              <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800 mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-4">
                  <span className="text-zinc-400">السعر الأصلي:</span>
                  <span className="text-xl font-sans line-through text-zinc-600">{product.price} ج.م</span>
                </div>

                {product.discount_price > 0 && (
                  <div className="flex justify-between items-center mb-4 text-orange-400">
                    <span>مبلغ الخصم:</span>
                    <span className="text-xl font-sans font-bold">- {product.discount_price} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">السعر النهائي:</span>
                  <span className="text-4xl font-black text-orange-500 font-sans tracking-tighter">
                    {finalPrice} <span className="text-sm font-normal">ج.م</span>
                  </span>
                </div>
              </div>

              {/* Status & Stock */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <p className="text-xs text-zinc-500 mb-1">حالة المخزون</p>
                  <p className={`font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {product.stock > 0 ? `متوفر (${product.stock})` : "نفذت الكمية"}
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <p className="text-xs text-zinc-500 mb-1">الحالة البرمجية</p>
                  <p className={`font-bold ${product.is_active ? 'text-blue-400' : 'text-zinc-500'}`}>
                    {product.is_active ? "نشط" : "غير نشط"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-orange-500 font-bold text-sm mb-2">وصف المنتج</p>
                <p className="text-zinc-400 leading-relaxed bg-zinc-800/20 p-4 rounded-xl border border-zinc-800">
                  {product.description || "لا يوجد وصف متوفر لهذا المنتج."}
                </p>
              </div>

              {/* Categories Badge */}
              <div>
                <p className="text-orange-500 font-bold text-sm mb-3">التصنيفات</p>
                <div className="flex flex-wrap gap-2">
                  {product.categories?.length > 0 ? (
                    product.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-1.5 rounded-full font-bold"
                      >
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600 italic">بدون تصنيف</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}