import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OfferPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://marisa-nonretired-willis.ngrok-free.dev'; 

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products-offers`);
        if (response.data.success) {
          setProducts(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-orange-500 text-xl animate-pulse font-bold">جاري تحميل أقوى العروض...</div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-right mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            عروض <span className="text-orange-500">حصرية</span> 🔥
          </h1>
          <p className="text-zinc-400 text-lg">اكتشف منتجاتنا المميزة بأسعار لا تقبل المنافسة</p>
          <div className="h-1 w-32 bg-orange-500 mt-4 mr-0 ml-auto rounded-full"></div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-500"
            >
              
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-orange-500 text-black text-sm font-black px-3 py-1 rounded-full z-10 shadow-xl">
                  وفر {product.discount_percentage}
                </div>
                
                <img
                  src={product.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  alt={product.name}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Details Section */}
              <div className="p-6 text-right">
                <h3 className="text-xl font-bold text-zinc-100 mb-3 truncate group-hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>

                <div className="flex flex-col items-end gap-1 mb-6">
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        وفرت {product.discount_amount} ج.م
                      </span>
                      <span className="text-2xl font-black text-white font-sans">
                        {product.offer_price} <span className="text-sm font-normal text-zinc-400">ج.م</span>
                      </span>
                   </div>
                   <span className="text-sm text-zinc-500 line-through font-sans tracking-wide">
                     {product.original_price} ج.م
                   </span>
                </div>

                {/* Single Action Button */}
                <Link 
                  to={`/products/${product.id}`} 
                  className="block w-full text-center bg-zinc-100 text-black py-4 rounded-2xl font-bold hover:bg-orange-500 hover:text-black transition-all duration-300 transform active:scale-95"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-xl">لا توجد عروض متاحة حالياً.. انتظرونا قريباً!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferPage;