import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/productcard";
import ProductSearch from "../components/ProductSearch";
import { Search, ChevronLeft, ChevronRight, PackageOpen, Loader2 } from "lucide-react"; // أيقونات إضافية

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const navigate = useNavigate();

  useEffect(() => {
    if (search) {
      navigate("/products", { replace: true });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = search
      ? `https://marisa-nonretired-willis.ngrok-free.dev/api/products/search?q=${search}&page=${currentPage}`
      : `https://marisa-nonretired-willis.ngrok-free.dev/api/products?page=${currentPage}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const productsArray = res.data?.data || [];
        const productsWithImages = productsArray.map((product) => ({
          ...product,
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
              : `https://marisa-nonretired-willis.ngrok-free.dev/storage/${product.image}`
            : null,
        }));
        setProducts(productsWithImages);
        setLastPage(res.data?.last_page || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' }); // صعود تلقائي عند تغيير الصفحة
  }, [search, currentPage]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* --- الهيدر الاحترافي --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              {search ? (
                <span>نتائج: <span className="text-blue-500">"{search}"</span></span>
              ) : (
                "استعرض المنتجات"
              )}
            </h1>
            <p className="text-gray-500">اكتشف أفضل القطع المختارة بعناية لك</p>
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              showSearch 
              ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
              : "bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
            }`}
          >
            <Search size={20} />
            {showSearch ? "إغلاق البحث" : "بحث سريع"}
          </button>
        </div>

        {/* --- قسم البحث المتطور --- */}
        {showSearch && (
          <div className="mb-12 p-6 bg-zinc-900/50 rounded-[2rem] border border-blue-500/20 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
            <ProductSearch />
          </div>
        )}

        {/* --- حالة التحميل (Skeleton) --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-zinc-900/50 rounded-3xl h-[400px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <>
            {/* --- حالة لا توجد نتائج --- */}
            {!products.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-zinc-900 p-8 rounded-full mb-6">
                  <PackageOpen size={64} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-300">لم نجد ما تبحث عنه</h3>
                <p className="text-gray-500 max-w-sm">جرب استخدام كلمات بحث مختلفة أو تصفح الأقسام الأخرى.</p>
                <button 
                  onClick={() => navigate("/products")}
                  className="mt-6 text-blue-500 font-semibold hover:underline"
                >
                  عرض كل المنتجات
                </button>
              </div>
            ) : (
              /* --- عرض المنتجات --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* --- نظام ترقيم الصفحات (Pagination) --- */}
            {lastPage > 1 && (
              <div className="flex justify-center items-center mt-20 gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="flex items-center gap-2 bg-zinc-900/50 px-6 py-3 rounded-2xl border border-white/5">
                  <span className="text-blue-500 font-black text-lg">{currentPage}</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-400 font-medium">{lastPage}</span>
                </div>

                <button
                  disabled={currentPage === lastPage}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;