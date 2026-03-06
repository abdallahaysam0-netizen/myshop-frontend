import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, Menu, X } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const Navbar = () => {
  const { userName, setUserName, userRole, notifications, setNotifications, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // دالة لمسح الإشعارات
  const clearNotifications = () => setNotifications([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      setNotifications(res.data);
    } catch (e) {
      console.error("خطأ في جلب الإشعارات:", e);
    }
  };

  // استدعاء جلب الإشعارات عند وجود مستخدم أو تغيير المسار
  useEffect(() => {
    if (userName) {
      fetchNotifications();
    }
  }, [userName, location]);

  // التحقق من حالة الجلسة عند تحميل الصفحة
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    const customerToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("user_role");

    if ((adminToken || customerToken) && !userRole) {
      setUserRole(savedRole);
    }
  }, [location, userRole, setUserRole]);

  const handleLogout = async () => {
    try {
      const customerToken = localStorage.getItem("token");
      const adminToken = localStorage.getItem("admin_token");

      if (customerToken) {
        await fetch(`${API_BASE_URL}/customer/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customerToken}`,
            "X-Requested-With": "XMLHttpRequest"
          },
        });
      }

      if (adminToken) {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
            "X-Requested-With": "XMLHttpRequest"
          },
        });
      }

      localStorage.clear();
      sessionStorage.clear();
      setUserName(null);
      setUserRole(null);
      setNotifications([]);
      navigate("/customer/login");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-white hover:opacity-90 transition flex items-center gap-2">
          My<span className="text-blue-500">Shop</span>
        </Link>

        {/* Desktop Links & Action Buttons */}
        <div className="flex items-center gap-2 md:gap-8">

          {/* Links Section (Desktop Only) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">المنزل</Link>
            <Link to="/products" className="hover:text-white transition-colors">المنتجات</Link>

            {userName && (
              <>
                <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-2 relative">
                  <span className="text-lg">🛒</span> السلة
                  <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                </Link>
                <Link to="/order" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-lg">📦</span> طلباتي
                </Link>
              </>
            )}
          </div>

          <div className="h-6 w-[1px] bg-zinc-800 mx-2 hidden md:block"></div>

          {/* Action Buttons Section */}
          <div className="flex items-center gap-4">

            {/* 🔔 جرس الإشعارات */}
            {userName && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition"
                >
                  <Bell size={20} />
                  {notifications?.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute left-0 mt-3 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-[100]">
                    <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                      <span className="text-xs font-bold text-white">الإشعارات</span>
                      <button onClick={clearNotifications} className="text-[10px] text-zinc-500 hover:text-red-400">مسح الكل</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications?.length === 0 ? (
                        <div className="p-6 text-center text-zinc-600 text-xs">لا توجد إشعارات</div>
                      ) : (
                        notifications.map((n, i) => (
                          <div key={i} className="p-3 border-b border-zinc-800/50 hover:bg-zinc-800 transition">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                طلب #{n.order_id}
                              </span>
                              <span className="text-[9px] text-zinc-600">{n.created_at}</span>
                            </div>
                            <p className="text-[12px] text-zinc-300 leading-snug">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {userRole === 'admin' && (
              <Link
                to="/admin"
                className="hidden md:flex px-4 py-1.5 rounded-full border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold uppercase items-center gap-2"
              >
                الادمن
              </Link>
            )}

            {!userName ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/customer/login" className="text-sm font-medium text-zinc-400 hover:text-white transition">تسجيل الدخول</Link>
                <Link to="/customer/register" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95">إنشاء حساب</Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4 border-l border-zinc-800 pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 leading-none mb-1">مرحباً بك</span>
                  <span className="text-sm text-blue-400 font-bold">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-zinc-900 hover:bg-red-950/30 group border border-zinc-800 rounded-lg transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut size={18} className="text-zinc-400 group-hover:text-red-500 transition" />
                </button>
              </div>
            )}

            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

        {/* Drawer Content */}
        <div className="absolute top-0 right-0 w-3/4 max-w-sm h-full bg-[#09090b] border-l border-zinc-800 p-6 flex flex-col gap-8 shadow-2xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <Link to="/" className="text-xl font-black text-white" onClick={() => setIsMenuOpen(false)}>
              My<span className="text-blue-500">Shop</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="text-zinc-400">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-lg font-medium text-zinc-300">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-500 transition-colors">المنزل</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-500 transition-colors">المنتجات</Link>

            {userName && (
              <>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between hover:text-blue-500 transition-colors">
                  <span>السلة 🛒</span>
                  <span className="bg-blue-600/20 text-blue-500 text-xs px-2 py-1 rounded-full border border-blue-500/30">0</span>
                </Link>
                <Link to="/order" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-500 transition-colors">طلباتي 📦</Link>
              </>
            )}

            <div className="h-[1px] bg-zinc-800 w-full my-4"></div>

            {userRole === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl text-center font-bold"
              >
                لوحة التحكم (الأدمن)
              </Link>
            )}

            {!userName ? (
              <div className="flex flex-col gap-4">
                <Link to="/customer/login" onClick={() => setIsMenuOpen(false)} className="w-full py-3 border border-zinc-800 text-center rounded-xl text-zinc-400">تسجيل الدخول</Link>
                <Link to="/customer/register" onClick={() => setIsMenuOpen(false)} className="w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold shadow-lg shadow-blue-600/20">إنشاء حساب</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">مرحباً بك</span>
                    <span className="text-sm text-white font-bold">{userName}</span>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full py-4 bg-red-950/20 text-red-500 border border-red-900/30 rounded-2xl flex items-center justify-center gap-3 font-bold"
                >
                  <LogOut size={20} />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;