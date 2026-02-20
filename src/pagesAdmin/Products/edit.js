import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // الحالة الابتدائية ككائن لتجنب مشاكل الـ null في البداية
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    price: "",
    discount_price: "", // الحقل الجديد
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 1. جلب الفئات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories");
        const data = await res.json();
        if (data.status === "success" || data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          const p = data.data;
          setProduct({
            name: p.name || "",
            slug: p.slug || "",
            price: p.price || "",
            discount_price: p.discount_price || "", // تحميل القيمة القديمة
            stock: p.stock || "",
            description: p.description || "",
            image: p.image || ""
          });
          setSelectedCategories(p.categories?.map(c => c.id) || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setProduct({
        ...product,
        name: value,
        slug: value.replace(/\s+/g, "-").toLowerCase(),
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", product.name);
    formData.append("slug", product.slug);
    formData.append("price", product.price);
    formData.append("discount_price", product.discount_price); // إرسال قيمة الخصم
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    if (image) formData.append("image", image);
    
    selectedCategories.forEach(catId => formData.append("categories[]", catId));

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("تم التعديل بنجاح!");
        navigate("/admin/products");
      }
    } catch (err) {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  if (loading) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex bg-black min-h-screen text-zinc-100">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-black mb-8 text-orange-500">تعديل المنتج</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Upload Area */}
            <div className="md:col-span-2 flex flex-col items-center p-6 border-2 border-dashed border-zinc-700 rounded-2xl hover:border-orange-500 transition-colors">
              <img 
                src={image ? URL.createObjectURL(image) : product.image} 
                className="w-40 h-40 object-cover rounded-xl mb-4 border border-zinc-700" 
                alt="Product"
              />
              <input 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])}
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-500 file:text-black hover:file:bg-orange-600"
              />
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400">اسم المنتج</label>
              <input 
                name="name" value={product.name} onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400">Slug</label>
              <input 
                name="slug" value={product.slug} onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400">السعر الأصلي</label>
              <input 
                name="price" type="number" value={product.price} onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400 text-orange-400">مبلغ الخصم (ج.م)</label>
              <input 
                name="discount_price" type="number" value={product.discount_price} onChange={handleChange}
                placeholder="مثلاً: 2000"
                className="bg-zinc-800 border border-orange-500/30 p-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-orange-500 font-bold"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400">المخزون (Stock)</label>
              <input 
                name="stock" type="number" value={product.stock} onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400">الفئات</label>
              <select 
                multiple value={selectedCategories} 
                onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, o => o.value))}
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl h-32 focus:outline-none focus:border-orange-500 transition-all"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-400">الوصف</label>
              <textarea 
                name="description" value={product.description} onChange={handleChange} rows="4"
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20">
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}