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
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { name: "لوحة التحكم", link: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "الطلبات", link: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { name: "المنتجات", link: "/admin/products", icon: <Box size={20} /> },
  { name: "الأقسام", link: "/admin/categories", icon: <Layers size={20} /> },
  { name: "المستخدمين", link: "/admin/users", icon: <Users size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] p-3 bg-blue-600 text-white rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed lg:sticky top-0 right-0 h-screen bg-[#050505] border-l border-white/5 flex flex-col p-6 z-[56] transition-transform duration-300 w-72
        ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>

        {/* --- الشعار (Brand) --- */}
        <div className="mb-12 px-4 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2 italic">
            My<span className="text-blue-500">Shop</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full not-italic tracking-normal">ADMIN</span>
          </h2>
        </div>

        {/* --- القائمة (Navigation) --- */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[2px] mb-4 px-4">القائمة الرئيسية</p>

          {sidebarItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              onClick={() => setIsOpen(false)}
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
    </>
  );
}