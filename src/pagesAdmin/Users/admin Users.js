import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Shield, Trash2, Users, Search, Loader2, UserCheck } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if (!token) {
      navigate("/customer/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      });

      if (!res.ok) throw new Error("فشل في جلب البيانات");

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ هل أنت متأكد من حذف هذا الحساب نهائياً؟")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(data.message || "حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  };

  // دالة للحصول على ستايل الرتبة
  const getRoleStyle = (type) => {
    return type?.toLowerCase() === 'admin' 
      ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        {/* خلفية ضوئية */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* الهيدر */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">إدارة المستخدمين</h1>
              <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                 <span className="flex items-center gap-1"><Users size={16}/> إجمالي المسجلين: {users.length}</span>
              </div>
            </div>

            <Link
              to="/create/users"
              className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95"
            >
              <UserPlus size={20} />
              إضافة مستخدم جديد
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1,2,3].map(n => <div key={n} className="h-64 bg-zinc-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map((user) => (
                <div key={user.id} className="group relative bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md hover:bg-zinc-900/60 transition-all hover:border-blue-500/20 shadow-xl overflow-hidden">
                  
                  {/* الديكور الخلفي للكارت */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      {/* Avatar (أول حرف من الاسم) */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* شارة الدور */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getRoleStyle(user.type)}`}>
                        {user.type || 'User'}
                      </span>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{user.name}</h2>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Mail size={14} className="text-zinc-700" />
                        {user.email}
                      </p>
                    </div>

                    {/* الإجراءات */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                        <Shield size={14} /> 
                        {user.type === 'admin' ? 'Full Access' : 'Limited Access'}
                      </div>
                      
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                        title="حذف المستخدم"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
                <Users size={48} className="mx-auto mb-4 text-zinc-800" />
                <p className="text-gray-500 font-medium">لا يوجد مستخدمين مسجلين حالياً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}