import { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import Sidebar from "../../components/sidebar";

export default function AdminCreateCategory() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [parent, setParent] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = "اسم الفئة مطلوب";
        }
        if (!slug.trim()) {
            newErrors.slug = "الرابط مطلوب";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found! Please login.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", slug || name.replace(/\s+/g, "-").toLowerCase());
        formData.append("description", description);
        formData.append("parent", parent);


        formData.append("sku", "SKU-" + Date.now());

        try {
            const res = await fetch(`${API_BASE_URL}/categories`, {

                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true", // لتخطي شاشة ngrok
                },
                body: formData,
            });

            // قراءة الـ response بعد الـ fetch
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.log("Non-JSON response:", text);
                alert("Server returned non-JSON response. Check console.");
                return;
            }

            console.log("Response:", data);

            if (!res.ok) {
                alert("Error: " + JSON.stringify(data));
                return;
            }

            alert("تم إنشاء الفئة بنجاح");
            // إعادة تعيين الحقول بعد الإنشاء
            setName("");
            setDescription("");
            setParent("");
            setSlug("");
            setErrors({});
        } catch (err) {
            console.error("Fetch error:", err);
            alert("حدث خطأ في الإرسال: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 lg:p-12 pt-20 lg:pt-12 overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
                    <h2 className="text-3xl font-black mb-8 text-right text-blue-500 uppercase tracking-tight">إنشاء فئة جديدة</h2>
                    <div className="space-y-6 text-right" dir="rtl">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                اسم الفئة *
                            </label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="name"
                                placeholder="أدخل اسم الفئة"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                الرابط *
                            </label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="slug"
                                placeholder="رابط الفئة"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                الوصف
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="description"
                                placeholder="أدخل وصف الفئة"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                        </div>

                        <div>
                            <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
                                الفئة الأصل
                            </label>
                            <input
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                id="parent"
                                placeholder="أدخل الفئة الأصل"
                                value={parent}
                                onChange={(e) => setParent(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "جاري الإنشاء..." : "إنشاء فئة"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
