import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react"; // أيقونات للبحث والمسح

function ProductSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      performSearch();
    }
  };

  const performSearch = () => {
    if (query.trim() !== "") {
      navigate(`/products?search=${query}`);
    }
  };

  const clearQuery = () => {
    setQuery("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto group">
      <div className="relative flex items-center">
        {/* أيقونة البحث في البداية */}
        <div className="absolute right-4 text-gray-500 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} />
        </div>

        <input
          type="text"
          placeholder="ابحث عن ماركة، نوع، أو منتج معين..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            w-full
            bg-zinc-900/50
            backdrop-blur-xl
            text-white
            placeholder:text-gray-600
            rounded-2xl
            border
            border-white/10
            pr-12 
            pl-12
            py-4
            text-lg
            transition-all
            duration-300
            outline-none
            focus:border-blue-500/50
            focus:bg-zinc-900/80
            focus:ring-4
            focus:ring-blue-500/10
            shadow-2xl
          "
        />

        {/* زر مسح النص - يظهر فقط عند الكتابة */}
        {query && (
          <button
            onClick={clearQuery}
            className="absolute left-4 p-1 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all animate-in fade-in scale-in"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* تلميح صغير للمستخدم */}
      <p className="mt-3 text-center text-xs text-gray-600 tracking-wide uppercase">
        اضغط <span className="text-gray-400 font-bold">Enter</span> للبحث السريع
      </p>
    </div>
  );
}

export default ProductSearch;