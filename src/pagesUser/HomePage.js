import React from "react";
import CategoriesPage from "./CategoriesPage";


const HomePage = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">

      {/* --- Section: Hero --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0a0a10] to-[#050505] pt-32 pb-16 border-b border-white/5">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent blur-3xl" />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="text-center max-w-3xl mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-fade-in">
              وصل حديثاً: تشكيلة شتاء 2026
            </span>
            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">MyShop</span> ارتقِ بتجربتك مع
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-400 leading-relaxed">
              نجمع لك الجودة، الأناقة، وأحدث الابتكارات في مكان واحد. تسوق بذكاء، تسوق الآن.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/products"
                className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-12 rounded-2xl font-bold transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
              >
                تسوّق الآن
              </a>
              <a
                href="#offers"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white py-4 px-12 rounded-2xl font-bold transition-all"
              >
                مشاهدة العروض
              </a>
            </div>
          </div>

          {/* Hero Image Optimization */}
          <div className="relative w-full max-w-3xl group">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
            <img
              src="/images/hero.png"
              alt="Premium Hero"
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 hover:-translate-y-2"
            />
          </div>
        </div>
      </section>

{/* --- Section: Categories --- */}
<section className="py-24 relative overflow-hidden">
  {/* تأثير ضوئي خلفي جانبي لإعطاء عمق (Glow Effect) */}
  <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

  <div className="container mx-auto px-6">
    {/* الهيدر: تم تحسين المحاذاة لتبدو أكثر انسيابية */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-blue-600 rounded-full" />
          <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">تصفح المجموعات</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          أقسام <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-blue-600">المنتجات</span>
        </h2>
      </div>
      
      {/* تم تحسين النص الوصفي ليكون متناسقاً مع التصميم بدون ml-40 الثابتة */}
      <p className="text-gray-400 max-w-sm text-lg leading-relaxed border-r-2 border-white/5 pr-6">
        تصفح مجموعتنا الواسعة المصنفة بعناية لتجد ما يناسب احتياجاتك تماماً وبأعلى جودة.
      </p>
    </div>

    {/* حاوية الأقسام: إضافة تأثير Glassmorphism أقوى */}
    <div className="relative group">
      {/* توهج خفي يظهر خلف الحاوية عند مرور الماوس */}
      <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative bg-zinc-900/20 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 hover:border-blue-500/20 transition-all duration-500 shadow-2xl">
        <CategoriesPage />
      </div>
    </div>
  </div>
</section>

      {/* --- Section: Features --- */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              emoji="🚚"
              title="شحن سريع ومجاني"
              desc="للطلبات فوق 500 جنيه خلال 48 ساعة"
            />
            <FeatureCard
              emoji="🛡️"
              title="دفع آمن 100%"
              desc="تشفير كامل لبياناتك البنكية وبوابات دفع موثوقة"
            />
            <FeatureCard
              emoji="🔄"
              title="سياسة إرجاع مرنة"
              desc="استبدل أو استرجع منتجك خلال 14 يوماً بكل سهولة"
            />
          </div>
        </div>
      </section>

      {/* --- Section: Promo (Offers) --- */}
      <section id="offers" className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-12 md:p-20 text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                أقوى عروض <br /> <span className="text-amber-400">نهاية الأسبوع!</span>
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto opacity-90 font-light">
                استمتع بخصومات تصل إلى <span className="text-3xl font-bold text-white">50%</span> على جميع الإلكترونيات والملابس المختارة.
              </p>
              <a
                href="/offer"
                className="bg-white text-blue-900 py-4 px-12 rounded-2xl font-black hover:bg-gray-100 transition-all shadow-2xl active:scale-95 inline-block"
              >
                اغتنم الفرصة الآن
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section: Newsletter --- */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">انضم إلى مجتمعنا</h2>
            <p className="text-gray-400 mb-8">كن أول من يعلم بالخصومات الحصرية والمنتجات الجديدة التي تصلنا يومياً.</p>
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900 border border-white/10 rounded-2xl focus-within:border-blue-500 transition-all">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-6 py-3 bg-transparent text-white outline-none placeholder:text-gray-600"
              />
              <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-colors whitespace-nowrap">
                اشترك الآن
              </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

// Component داخلي للـ Features لتقليل تكرار الكود وسهولة التعديل
const FeatureCard = ({ emoji, title, desc }) => (
  <div className="group p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2">
    <div className="text-5xl mb-6 bg-zinc-800 w-20 h-20 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
      {emoji}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default HomePage;