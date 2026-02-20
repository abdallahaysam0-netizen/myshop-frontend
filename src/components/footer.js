import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"; // استيراد الأيقونات

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] pt-20 pb-10 overflow-hidden border-t border-white/5">
      {/* تأثير ضوئي خفيف خلف الـ Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
          
          {/* العمود الأول: عن المتجر */}
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-white tracking-tight">
              My<span className="text-blue-500">Shop</span>
            </h1>
            <p className="text-gray-400 leading-relaxed text-sm">
              وجهتك الأولى لأحدث المنتجات العالمية بأعلى جودة وأفضل الأسعار. نحن نؤمن بأن التسوق يجب أن يكون تجربة فريدة وممتعة.
            </p>
            <div className="flex justify-start gap-4">
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Facebook size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h3 className="text-white font-bold mb-6">روابط سريعة</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><FooterLink text="الرئيسية" href="/" /></li>
              <li><FooterLink text="جميع المنتجات" href="/products" /></li>
              <li><FooterLink text="الأقسام" href="/categories" /></li>
              <li><FooterLink text="العروض" href="#offers" /></li>
            </ul>
          </div>

          {/* العمود الثالث: الدعم والقانونية */}
          <div>
            <h3 className="text-white font-bold mb-6">الدعم الفني</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><FooterLink text="سياسة الخصوصية" href="/privacy" /></li>
              <li><FooterLink text="الشروط والأحكام" href="/terms" /></li>
              <li><FooterLink text="الأسئلة الشائعة" href="/faq" /></li>
              <li><FooterLink text="سياسة الإرجاع" href="/returns" /></li>
            </ul>
          </div>

          {/* العمود الرابع: تواصل معنا */}
          <div className="space-y-4 text-sm text-gray-400">
            <h3 className="text-white font-bold mb-6">تواصل معنا</h3>
            <div className="flex items-center gap-3 justify-end">
              <span>support@myshop.com</span>
              <Mail size={18} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <span>+20 123 456 789</span>
              <Phone size={18} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <span>القاهرة، مصر</span>
              <MapPin size={18} className="text-blue-500" />
            </div>
          </div>

        </div>

        {/* الجزء السفلي: حقوق النشر */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© 2026 MyShop. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">English</span>
            <span className="hover:text-white transition-colors cursor-pointer">العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// مكون فرعي للروابط مع تأثير Hover
const FooterLink = ({ text, href }) => (
  <a href={href} className="hover:text-blue-500 hover:translate-x-[-5px] transition-all inline-block duration-300">
    {text}
  </a>
);

// مكون فرعي لأيقونات السوشيال ميديا
const SocialIcon = ({ icon }) => (
  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all cursor-pointer shadow-lg">
    {icon}
  </div>
);

export default Footer;