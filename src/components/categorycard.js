import { Link } from "react-router-dom";
import { ChevronRight, Box } from "lucide-react"; // أيقونات بسيطة وأنيقة

const CategoryCard = ({ category }) => {
  // دالة بسيطة لتعيين لون مختلف لكل كارت بناءً على الـ ID ليعطي تنوعاً بصرياً
  const getGradient = (id) => {
    const gradients = [
      "from-blue-600 to-indigo-700",
      "from-purple-600 to-blue-700",
      "from-zinc-800 to-zinc-950",
      "from-indigo-600 to-purple-700",
    ];
    return gradients[id % gradients.length];
  };

  return (
    <Link to={`/categories/${category.id}`} className="group block h-full">
      <div className={`relative h-44 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${getGradient(category.id)} p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]`}>
        
        {/* عنصر ديكوري خلفي (دوائر ضوئية) */}
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* أيقونة رمزية */}
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Box className="text-white opacity-80" size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-1">
              {category.name}
            </h2>
            <div className="flex items-center text-white/60 text-sm font-medium group-hover:text-white transition-colors">
              استكشف القسم
              <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* خط ضوئي يظهر عند الـ Hover في الأسفل */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/40 w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </Link>
  );
};

export default CategoryCard;