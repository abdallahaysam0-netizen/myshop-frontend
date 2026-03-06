import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../apiConfig";
import CategoryCard from "../components/categorycard";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(res => res.json())
      .then(data => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // --- واجهة التحميل الذكية (Skeleton Loader) ---
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-zinc-900/50 rounded-3xl h-64 border border-white/5"></div>
        ))}
      </div>
    );
  }

  // --- واجهة حالة عدم وجود بيانات ---
  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-24 md:pt-32 pb-20 px-6 font-sans text-center rounded-3xl border border-dashed border-zinc-800" dir="rtl">
        <p className="text-gray-500 text-lg">لا توجد أقسام متاحة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 transition-all duration-500 ease-in-out">
      {categories.map((cat, index) => (
        <div
          key={cat.id}
          className="transform transition-all duration-500"
          style={{ transitionDelay: `${index * 100}ms` }} // تأثير ظهور تتابعي بسيط
        >
          <CategoryCard category={cat} />
        </div>
      ))}
    </div>
  );
};

export default CategoriesPage;