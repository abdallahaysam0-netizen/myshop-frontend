import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/productcard"; // استدعاء المكون الذي صممناه سابقاً
import { ArrowRight, LayoutGrid, Loader2, ShoppingBag } from "lucide-react";

const CategoryProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://marisa-nonretired-willis.ngrok-free.dev/api/categories/${id}/products`, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then(res => res.json())
      .then(data => {
        // معالجة روابط الصور لتكون صحيحة وجاهزة للعرض
        const productsWithImages = (data.data || []).map((product) => ({
          ...product,
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
              : `https://marisa-nonretired-willis.ngrok-free.dev/storage/${product.image}`
            : null,
        }));
        setProducts(productsWithImages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* --- الهيدر (Header Section) --- */}
        <div className="mb-12  flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <button 
              onClick={() => navigate("/categories")}
              className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors group text-sm font-bold"
            >
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              العودة للأقسام
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              <LayoutGrid className="text-blue-500" size={32} />
              منتجات القسم
            </h1>
          </div>
          
          <div className="bg-zinc-900/50 px-6 py-3 rounded-2xl border border-white/5 text-sm font-bold text-gray-400">
             تم العثور على <span className="text-blue-500">{products.length}</span> منتج
          </div>
        </div>

        {/* --- حالة التحميل (Skeleton) --- */}
        {loading ? (
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-zinc-900/50 rounded-[2rem] h-[420px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <>
            {/* --- حالة لا توجد منتجات --- */}
            {products.length === 0 ? (
              <div className="text-center py-24 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
                <ShoppingBag size={64} className="mx-auto mb-6 text-zinc-800" />
                <h3 className="text-2xl font-bold mb-2">هذا القسم فارغ حالياً</h3>
                <p className="text-gray-500 mb-8">نحن نعمل على إضافة منتجات جديدة لهذا القسم قريباً.</p>
                <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all">
                    تصفح جميع المنتجات
                </Link>
              </div>
            ) : (
              /* --- عرض الشبكة (Product Grid) --- */
              <div className=" ml-60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProduct;