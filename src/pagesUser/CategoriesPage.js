import React, { useState, useEffect } from "react";
import CategoryCard from "../components/categorycard";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-zinc-900/50 rounded-3xl h-64 border border-white/5"></div>
        ))}
      </div>
    );
  }

  // --- واجهة حالة عدم وجود بيانات ---
  if (categories.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
        <p className="text-gray-500 text-lg">لا توجد أقسام متاحة حالياً.</p>
      </div>
    );
  }

  return (
    <div className=" ml-40 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 transition-all duration-500 ease-in-out">
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