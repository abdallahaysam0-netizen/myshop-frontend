import { Link } from "react-router-dom";
import { ShoppingBag, Eye, Star } from "lucide-react"; // أيقونات لإضافة لمسة جمالية

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-zinc-900/40 border border-white/5 rounded-[2rem] p-3 transition-all duration-500 hover:bg-zinc-900/60 hover:border-blue-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col h-full">
      
      {/* --- قسم الصورة --- */}
      <div className="relative overflow-hidden rounded-[1.5rem] h-64 bg-zinc-800">
        <img 
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* طبقة تظهر عند الـ Hover فوق الصورة */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link 
              to={`/products/${product.id}`}
              className="p-3 bg-white text-black rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-xl"
            >
              <Eye size={20} />
            </Link>
            <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors shadow-xl">
              <ShoppingBag size={20} />
            </button>
        </div>

        {/* شارة السعر فوق الصورة */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
            <span className="text-blue-400 font-bold text-sm">{product.price} ج.م</span>
        </div>
      </div>

      {/* --- تفاصيل المنتج --- */}
      <div className="p-4 flex flex-col flex-grow">
        {/* التقييم (شكل جمالي) */}
        <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span className="text-xs text-gray-500 font-medium">4.8 (تقييم)</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}
        </p>

        {/* الفئات (Tags) */}
        {product.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {product.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* زر الإجراء السفلي */}
        <Link
          to={`/products/${product.id}`}
          className="mt-auto w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-center transition-all hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
        >
          تفاصيل المنتج
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;