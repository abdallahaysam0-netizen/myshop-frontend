import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";

export default function AdminCreateProduct() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState(""); // حقل الخصم الجديد
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [slug, setSlug] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // جلب الفئات عند التحميل
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://marisa-nonretired-willis.ngrok-free.dev/api/categories");
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("لم يتم العثور على التوكن! يرجى تسجيل الدخول.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("discount_price", discountPrice); // إرسال مبلغ الخصم
        formData.append("description", description);
        formData.append("stock", stock);
        formData.append("image", image);
        formData.append("slug", slug || name.replace(/\s+/g, "-").toLowerCase());
        formData.append("sku", "SKU-" + Date.now());
        
        selectedCategories.forEach((catId) => {
            formData.append("categories[]", catId);
        });

        try {
            const res = await fetch("https://marisa-nonretired-willis.ngrok-free.dev/api/products", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("تم إنشاء المنتج بنجاح! 🎉");
                // إعادة تعيين الحقول
                setName("");
                setPrice("");
                setDiscountPrice("");
                setDescription("");
                setStock("");
                setImage(null);
                setSlug("");
                setSelectedCategories([]);
            } else {
                alert("خطأ: " + JSON.stringify(data.message || data));
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("حدث خطأ في الاتصال بالسيرفر");
        }
    };

    return (
        <div className="flex bg-black min-h-screen text-zinc-100 font-sans">
            <Sidebar />
            
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
                    <div className="mb-10 text-right">
                        <h2 className="text-3xl font-black text-orange-500">إضافة منتج جديد</h2>
                        <p className="text-zinc-500 mt-2">قم بملء البيانات أدناه لإنشاء منتج جديد في المتجر</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
                        
                        {/* Image Upload Area */}
                        <div className="md:col-span-2 flex flex-col items-center p-8 border-2 border-dashed border-zinc-700 rounded-2xl hover:border-orange-500 transition-all bg-zinc-800/30">
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover rounded-xl mb-4 border border-zinc-600 shadow-lg"
                                />
                            ) : (
                                <div className="w-48 h-48 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-zinc-600 border border-zinc-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <input
                                type="file"
                                className="text-sm text-zinc-400 file:ml-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-orange-500 file:text-black hover:file:bg-orange-600 cursor-pointer"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>

                        {/* Name Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-400 mr-2">اسم المنتج</label>
                            <input 
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white" 
                                placeholder="أدخل اسم المنتج" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>

                        {/* Price Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-400 mr-2">السعر الأصلي (ج.م)</label>
                            <input 
                                type="number"
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white font-sans" 
                                placeholder="0.00" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                            />
                        </div>

                        {/* Discount Price Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-orange-400 mr-2">قيمة الخصم (ج.م)</label>
                            <input 
                                type="number"
                                className="bg-zinc-800 border border-orange-500/30 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-orange-500 font-bold font-sans" 
                                placeholder="ادخل المبلغ المراد خصمه" 
                                value={discountPrice} 
                                onChange={(e) => setDiscountPrice(e.target.value)} 
                            />
                        </div>

                        {/* Stock Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-400 mr-2">المخزون المتوفر</label>
                            <input 
                                type="number"
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white font-sans" 
                                placeholder="0" 
                                value={stock} 
                                onChange={(e) => setStock(e.target.value)} 
                            />
                        </div>

                        {/* Slug Field */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-zinc-400 mr-2">الرابط البديل (Slug)</label>
                            <input 
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-zinc-400 font-sans" 
                                placeholder="product-url-example" 
                                value={slug} 
                                onChange={(e) => setSlug(e.target.value)} 
                            />
                        </div>

                        {/* Category Select */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-zinc-400 mr-2">الفئة (يمكنك اختيار أكثر من واحدة)</label>
                            <select
                                multiple
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white h-32"
                                value={selectedCategories}
                                onChange={(e) =>
                                    setSelectedCategories(
                                        Array.from(e.target.selectedOptions, (option) => option.value)
                                    )
                                }
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="p-2">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description Field */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-zinc-400 mr-2">وصف المنتج</label>
                            <textarea 
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white resize-none" 
                                rows="4"
                                placeholder="اكتب تفاصيل المنتج هنا..." 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 pt-4">
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 text-xl transform active:scale-95">
                                إنشاء المنتج الآن
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}