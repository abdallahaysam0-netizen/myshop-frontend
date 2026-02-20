import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, Truck, MapPin, User, Phone, X, 
  AlertCircle, CheckCircle2, Loader2, Smartphone, Hash, Globe, Home 
} from "lucide-react";

// ✅ الرابط الأساسي الخاص بك (تأكد من استخدامه في كل طلبات الـ API)
const API_BASE_URL = "https://marisa-nonretired-willis.ngrok-free.dev";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    shipping_name: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "Egypt",
    shipping_zipcode: "",
    shipping_phone: "",
    payment_method: "cod", 
    notes: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [fawryCode, setFawryCode] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentMethodChange = (e) => {
    setFormData(prev => ({ ...prev, payment_method: e.target.value }));
    setIframeUrl(null);
    setFawryCode(null);
  };

  const submitOrder = async () => {
    if (!token) {
        setErrorDetails({ message: "الرجاء تسجيل الدخول أولاً لإتمام الطلب" });
        return;
    }

    setLoading(true);
    setErrorDetails(null);

    try {
        const res = await fetch(`${API_BASE_URL}/api/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true" 
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log("الرد القادم من السيرفر:", data);

        // 1. معالجة أخطاء التحقق (Validation)
        if (res.status === 422) {
            const validationErrors = data.errors 
                ? Object.values(data.errors).flat().join(' - ') 
                : data.message;
            setErrorDetails({ message: `تأكد من البيانات: ${validationErrors}` });
            setLoading(false);
            return;
        }

        if (!res.ok || !data.status) {
            setErrorDetails({ message: data.message || "فشل إتمام الطلب" });
            setLoading(false);
            return;
        }

        setLoading(false);

        // 2. حالة الدفع عند الاستلام
        if (formData.payment_method === "cod") {
            navigate("/order?status=success");
            return;
        }

        // 3. حالة الدفع الإلكتروني (Paymob)
        if (data.payment_required) {
            // ✅ الحل السحري: نتحقق إذا كانت البيانات داخل 'data' أو في الرد مباشرة
            const paymentInfo = data.data || data; 

            if (formData.payment_method === "credit_card") {
                if (paymentInfo.iframe_url) {
                    setIframeUrl(paymentInfo.iframe_url);
                } else {
                    setErrorDetails({ message: "تعذر الحصول على رابط الدفع بالبطاقة" });
                }
            } 
            else if (formData.payment_method === "fawry") {
                const fCode = paymentInfo.bill_reference || paymentInfo.payment_reference;
                if (fCode) {
                    setFawryCode(fCode);
                } else {
                    setErrorDetails({ message: "تعذر الحصول على كود فوري" });
                }
            } 
            else if (formData.payment_method === "wallet") {
                if (paymentInfo.redirect_url) {
                    window.location.href = paymentInfo.redirect_url;
                } else {
                    setErrorDetails({ message: "فشل الحصول على رابط المحفظة" });
                }
            }
        }
        
    } catch (err) {
        setLoading(false);
        setErrorDetails({ message: "تعذر الاتصال بالسيرفر. تأكد من تشغيل ngrok والضغط على Visit Site." });
    }
};

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Truck size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">إتمام الشحن والدفع</h2>
            <p className="text-gray-500 text-sm">أدخل بياناتك بعناية لضمان وصول طلبك</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
          {errorDetails && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{errorDetails.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup icon={<User size={18} />} label="الاسم الكامل">
              <input name="shipping_name" placeholder="مثال: أحمد محمد" value={formData.shipping_name} onChange={handleChange} className="custom-input" />
            </InputGroup>

            <InputGroup icon={<Phone size={18} />} label="رقم الهاتف">
              <input name="shipping_phone" placeholder="01xxxxxxxxx" value={formData.shipping_phone} onChange={handleChange} className="custom-input" />
            </InputGroup>

            <div className="md:col-span-2">
              <InputGroup icon={<MapPin size={18} />} label="العنوان بالتفصيل">
                <input name="shipping_address" placeholder="اسم الشارع، رقم المبنى، الشقة" value={formData.shipping_address} onChange={handleChange} className="custom-input" />
              </InputGroup>
            </div>

            <InputGroup icon={<Home size={18} />} label="المدينة">
              <input name="shipping_city" placeholder="القاهرة" value={formData.shipping_city} onChange={handleChange} className="custom-input" />
            </InputGroup>

            <InputGroup icon={<MapPin size={18} />} label="المحافظة">
              <input name="shipping_state" placeholder="الجيزة" value={formData.shipping_state} onChange={handleChange} className="custom-input" />
            </InputGroup>

            <InputGroup icon={<Globe size={18} />} label="الرمز البريدي">
              <input name="shipping_zipcode" placeholder="12345" value={formData.shipping_zipcode} onChange={handleChange} className="custom-input" />
            </InputGroup>
          </div>

          <div className="mt-10 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-blue-400 border-t border-white/5 pt-6">
              <CreditCard size={20} /> اختر وسيلة الدفع
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PaymentOption id="cod" title="كاش" desc="الدفع عند الاستلام" selected={formData.payment_method === "cod"} onChange={handlePaymentMethodChange} />
              <PaymentOption id="credit_card" title="بطاقة بنكية" desc="فيزا / ماستر كارد" selected={formData.payment_method === "credit_card"} onChange={handlePaymentMethodChange} />
              <PaymentOption id="fawry" title="فوري" desc="كود دفع للمكينات" icon={<Hash size={16} />} selected={formData.payment_method === "fawry"} onChange={handlePaymentMethodChange} />
              <PaymentOption id="wallet" title="محفظة إلكترونية" desc="فودافون كاش" icon={<Smartphone size={16} />} selected={formData.payment_method === "wallet"} onChange={handlePaymentMethodChange} />
            </div>

            <button onClick={submitOrder} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
              {loading ? "جاري معالجة طلبك..." : "تأكيد الطلب والدفع"}
            </button>
          </div>
        </div>
      </div>

      {/* مودال كود فوري */}
      {fawryCode && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full text-center">
             <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
             </div>
             <h2 className="text-2xl font-bold mb-2">طلبك في الانتظار!</h2>
             <p className="text-gray-400 mb-6 text-sm">استخدم الكود التالي للدفع في أي منفذ فوري:</p>
             <div className="bg-white text-black py-4 rounded-xl text-4xl font-black tracking-[0.2em] mb-6">
                {fawryCode}
             </div>
             <button onClick={() => navigate("/order")} className="w-full bg-blue-600 py-4 rounded-xl font-bold">متابعة طلباتي</button>
          </div>
        </div>
      )}

      {/* مودال الـ Iframe للبطاقة البنكية */}
      {iframeUrl && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90">
            <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-4 flex justify-between items-center bg-zinc-100 text-black border-b">
                   <span className="font-bold flex items-center gap-2 text-blue-600"><CreditCard size={18} /> بوابة دفع بي موب الآمنة</span>
                   <X className="cursor-pointer hover:text-red-500 transition-colors" size={24} onClick={() => setIframeUrl(null)} />
                </div>
                <iframe src={iframeUrl} className="w-full flex-1" title="Paymob Payment" />
            </div>
         </div>
      )}

      <style>{`
        .custom-input { width: 100%; background: rgba(24, 24, 27, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); padding: 1rem 1.25rem; border-radius: 1rem; color: white; outline: none; transition: all 0.3s; }
        .custom-input:focus { border-color: #2563eb; background: rgba(24, 24, 27, 0.8); box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
      `}</style>
    </div>
  );
};

const InputGroup = ({ label, children, icon }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</label>
    {children}
  </div>
);

const PaymentOption = ({ id, title, desc, selected, onChange, icon }) => (
  <label className={`cursor-pointer flex flex-col p-5 rounded-2xl border-2 transition-all duration-300 ${selected ? 'border-blue-600 bg-blue-600/10' : 'border-white/5 bg-zinc-800/20 hover:border-white/20'}`}>
    <div className="flex justify-between items-center mb-1">
      <span className="font-bold flex items-center gap-2">{icon} {title}</span>
      <input type="radio" name="payment_method" value={id} checked={selected} onChange={onChange} className="w-4 h-4 accent-blue-600" />
    </div>
    <span className="text-xs text-gray-500">{desc}</span>
  </label>
);

export default CheckoutPage;