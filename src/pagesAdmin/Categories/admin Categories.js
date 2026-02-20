import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import { Link } from "react-router-dom";
import { 
  Layers, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  FolderTree, 
  Tag, 
  Loader2, 
  ChevronRight,
  Info
} from "lucide-react";

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true" // لتخطي شاشة ngrok
        },
      });

      const data = await res.json();
      if (data.status === "success") {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ هل أنت متأكد من حذف هذه الفئة؟ قد يؤثر هذا على المنتجات المرتبطة بها.")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.status === "success") {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data?.message || "حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        {/* تأثيرات إضاءة خلفية */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* الهيدر */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">إدارة الفئات</h1>
              <p className="text-gray-500 font-medium">نظم منتجاتك في أقسام واضحة ومنظمة</p>
            </div>
            
            <Link
              to="/admin/categories/create"
              className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              إضافة فئة جديدة
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
              <p className="text-gray-500 animate-pulse">جاري تحميل هيكل الأقسام...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div key={category.id} className="group relative bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-zinc-900/60 hover:border-blue-500/20 shadow-xl flex flex-col h-full overflow-hidden">
                  
                  {/* أيقونة ديكورية في الخلفية */}
                  <Layers className="absolute -right-4 -top-4 w-24 h-24 text-white/5 -rotate-12 group-hover:text-blue-500/10 transition-colors" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 border border-blue-500/20">
                        <FolderTree size={24} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        category.parent 
                        ? 'bg-zinc-800 text-gray-400 border-white/5' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                      }`}>
                        {category.parent ? 'فئة فرعية' : 'فئة رئيسية'}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black mb-1 group-hover:text-blue-400 transition-colors tracking-tight">
                      {category.name}
                    </h2>
                    <p className="text-xs text-blue-500/60 font-mono mb-4">/{category.slug}</p>

                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed italic">
                      {category.description || "لا يوجد وصف لهذه الفئة حالياً."}
                    </p>

                    {/* الفئة الأب */}
                    <div className="mt-auto mb-8">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Tag size={14} />
                        {category.parent ? (
                          <span>تتبع لـ: <span className="text-gray-300">{category.parent.name}</span></span>
                        ) : (
                          <span className="text-blue-500/50 uppercase tracking-wider">قسم أساسي</span>
                        )}
                      </div>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                      <Link
                        to={`/admin/categories/details/${category.id}`}
                        className="flex items-center justify-center p-3 rounded-xl bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-800 transition-all"
                        title="التفاصيل"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/admin/categories/edit/${category.id}`}
                        className="flex items-center justify-center p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all"
                        title="تعديل"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="flex items-center justify-center p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
                <Layers size={48} className="mx-auto mb-4 text-zinc-800" />
                <p className="text-gray-500 font-medium">لم يتم إنشاء أي فئات حتى الآن</p>
                <Link to="/admin/categories/create" className="text-blue-500 text-sm hover:underline mt-2 inline-block">أنشئ فئتك الأولى الآن</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}