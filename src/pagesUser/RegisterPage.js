import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const submitRegister = async () => {
    if (formData.password !== formData.password_confirmation) {
      setError("كلمة السر وتأكيد كلمة السر غير متطابقين");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("https://marisa-nonretired-willis.ngrok-free.dev/api/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user_name", res.data.user.name);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMismatch = formData.password !== formData.password_confirmation && formData.password_confirmation !== "";

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* عناصر ضوئية ديكورية */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-xl relative z-10">
        {/* الهيدر */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-6">
            <UserPlus size={32} />
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-2">إنشاء حساب جديد</h2>
          <p className="text-gray-500 font-medium">انضم إلينا اليوم واستمتع بتجربة تسوق فريدة</p>
        </div>

        {/* بطاقة التسجيل */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl">
          
          {/* عرض الأخطاء */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">الاسم بالكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="name"
                  placeholder="أدخل اسمك الثلاثي"
                  value={formData.name}
                  onChange={handleChange}
                  className="custom-input pr-12"
                />
              </div>
            </div>

            {/* البريد */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="custom-input pr-12"
                />
              </div>
            </div>

            {/* كلمة السر */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">كلمة السر</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="custom-input pr-12 pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* تأكيد كلمة السر */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">تأكيد كلمة السر</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`custom-input pr-12 pl-12 ${isPasswordMismatch ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* تنبيه عدم التطابق */}
          {isPasswordMismatch && (
            <p className="text-red-400 text-xs mt-4 flex items-center gap-1 font-bold">
              <AlertCircle size={14} /> كلمات السر غير متطابقة
            </p>
          )}

          {/* زر الإنشاء */}
          <button
            onClick={submitRegister}
            disabled={loading}
            className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
            {loading ? "جاري إنشاء حسابك..." : "إنشاء حساب الآن"}
          </button>

          {/* تذييل البطاقة */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-500 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link to="/customer/login" className="text-blue-500 font-bold hover:underline">سجل دخولك</Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-white text-xs transition-colors">
              <ArrowRight size={14} /> العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .custom-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1rem 1.25rem;
          border-radius: 1.25rem;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .custom-input:focus {
          border-color: rgba(37, 99, 235, 0.5);
          background: rgba(0, 0, 0, 0.6);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;