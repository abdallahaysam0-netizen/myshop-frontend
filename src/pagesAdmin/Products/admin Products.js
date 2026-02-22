import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Box, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://marisa-nonretired-willis.ngrok-free.dev/api/products?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.data);
        setLastPage(data.data.last_page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    try {
      const res = await fetch(`https://marisa-nonretired-willis.ngrok-free.dev/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        {/* تأثيرات ضوئية خلفية */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

        {/* الهيدر */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">إدارة المنتجات</h1>
            <p className="text-gray-500 font-medium">تحكم في المخزون، الأسعار، وتفاصيل المنتجات</p>
          </div>
          
          <Link
            to="/admin/Products/create"
            className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            إضافة منتج جديد
          </Link>
        </div>

        {/* عرض المنتجات */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-[450px] bg-zinc-900/50 rounded-[2.5rem] animate-pulse border border-white/5" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-zinc-900/40 border border-white/5 p-4 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-zinc-900/60 hover:border-blue-500/20 shadow-xl flex flex-col h-full">
                
                {/* صورة المنتج */}
                <div className="relative h-56 overflow-hidden rounded-[2rem] mb-6">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* شارة حالة المخزون */}
                  <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-md ${
                    product.stock > 0 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {product.stock > 0 ? `متوفر: ${product.stock}` : 'نافذ من المخزن'}
                  </div>
                </div>

                {/* تفاصيل المنتج */}
                <div className="px-2 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-black text-xl tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h2>
                    <span className="text-blue-500 font-black text-lg">{product.price} ج.م</span>
                  </div>

                  {/* الأقسام */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.categories?.map((cat) => (
                      <span key={cat.id} className="text-[10px] bg-white/5 text-gray-400 px-3 py-1 rounded-lg border border-white/5 font-bold">
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                {/* أزرار التحكم (Action Bar) */}
                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                  <Link
                    to={`/admin/Products/details/${product.id}`}
                    className="flex items-center justify-center p-3 rounded-xl bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-800 transition-all"
                    title="عرض التفاصيل"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    to={`/admin/Products/edit/${product.id}`}
                    className="flex items-center justify-center p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all"
                    title="تعديل المنتج"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                    title="حذف المنتج"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination الاحترافي */}
        {lastPage > 1 && (
          <div className="flex justify-center items-center mt-16 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>

            <div className="bg-zinc-900/50 px-6 py-2 rounded-2xl border border-white/5 font-bold text-sm">
              الصفحة <span className="text-blue-500">{currentPage}</span> من {lastPage}
            </div>

            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}