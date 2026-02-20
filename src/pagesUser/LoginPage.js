import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { Mail, Lock, LogIn, Loader2, AlertCircle, ArrowRight } from "lucide-react";

const LoginPage = () => {
    // استخراج الدوال اللازمة لتحديث حالة المستخدم في التطبيق بالكامل
    const { setUserId, setUserName, setUserRole } = useContext(UserContext);
    
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(""); 
    };

    const submitLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/login", formData);
            
            // استخراج البيانات من استجابة Laravel
            const { id, role, name } = res.data.user; 
            const token = res.data.token;
    
            // 2. التخزين في localStorage (تأكد من توحيد المسميات مع الـ Navbar)
            localStorage.setItem("token", token); // الـ Navbar يبحث عن 'token'
            localStorage.setItem("user_id", id);
            localStorage.setItem("user_name", name);
            localStorage.setItem("user_role", role);

            // إذا كان أدمن، نفضل تخزين توكن إضافي كما هو متوقع في منطق الـ Navbar الخاص بك
            if (role === "admin") {
                localStorage.setItem("admin_token", token);
            }
    
            // 3. تحديث الـ Context فوراً
            // هذا الجزء هو المسؤول عن اختفاء زر "دخول" وظهور "اسم المستخدم" في الـ Navbar فوراً
            setUserId(id);    
            setUserName(name);
            setUserRole(role);
    
            // 4. التوجيه
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "البريد الإلكتروني أو كلمة المرور خاطئة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
            {/* الخلفية الجمالية (الدوائر المضيئة) */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
                        My<span className="text-blue-500">Shop</span>
                    </h1>
                    <p className="text-gray-500 font-medium">مرحباً بك مجدداً، سجل دخولك للمتابعة</p>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8">تسجيل الدخول</h2>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6">
                            <AlertCircle size={18} />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pr-12 pl-4 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">كلمة السر</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pr-12 pl-4 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={submitLogin}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
                            {loading ? "جاري التحقق..." : "دخول"}
                        </button>
                    </div>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-gray-500 text-sm">
                            ليس لديك حساب؟{" "}
                            <Link to="/customer/register" className="text-blue-500 font-bold hover:underline">إنشاء حساب جديد</Link>
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-white text-xs transition-colors">
                            <ArrowRight size={14} /> العودة للرئيسية
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;