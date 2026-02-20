import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom"; // يفضل استخدام NavLink للتعامل مع الـ Active state
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Box, 
  Layers, 
  Users, 
  LogOut,
  ExternalLink
} from "lucide-react";

const sidebarItems = [
  { name: "لوحة التحكم", link: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "الطلبات", link: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { name: "المنتجات", link: "/admin/products", icon: <Box size={20} /> },
  { name: "الأقسام", link: "/admin/categories", icon: <Layers size={20} /> },
  { name: "المستخدمين", link: "/admin/users", icon: <Users size={20} /> },
];

export default function Sidebar() {
  return (
    <div className="w-72 h-screen sticky top-0 bg-[#050505] border-l border-white/5 flex flex-col p-6 z-50">
      
      {/* --- الشعار (Brand) --- */}
      <div className="mb-12 px-4">
        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 italic">
          My<span className="text-blue-500">Shop</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full not-italic tracking-normal">ADMIN</span>
        </h2>
      </div>

      {/* --- القائمة (Navigation) --- */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[2px] mb-4 px-4">القائمة الرئيسية</p>
        
        {sidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
              ${isActive 
                ? "bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)]" 
                : "text-gray-500 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <span className="transition-transform group-hover:scale-110">
              {item.icon}
            </span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* --- الجزء السفلي (Bottom Section) --- */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <Link 
          to="/" 
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 text-gray-400 hover:text-white transition-all text-xs font-bold border border-white/5"
        >
          عرض المتجر للعملاء
          <ExternalLink size={14} />
        </Link>

        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = "/customer/login";
          }}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}