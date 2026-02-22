import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Package, Clock, CheckCircle2, XCircle, ChevronLeft, 
  Calendar, CreditCard, ShoppingBag, AlertCircle, Hash, Copy, Loader2 
} from "lucide-react";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [searchParams] = useSearchParams();

  // الرابط الخاص بك كما طلبت دون تغيير
  const API_BASE_URL = "https://marisa-nonretired-willis.ngrok-free.dev";
  const token = localStorage.getItem("token");

  useEffect(() => {
    // التحقق من حالة الدفع القادمة من روابط الـ Callback (Success/Failed)
    const status = searchParams.get('status');
    const orderId = searchParams.get('order_id');

    if (status === 'success' && orderId) {
      console.log("Success Payment for order:", orderId);
      // إشعار نجاح الدفع - سيتم تحديثه من الخادم
    }

    if (!token) {
      setError("يجب عليك تسجيل الدخول لرؤية طلباتك.");
      setLoading(false);
      return;
    }

    // جلب الطلبات
    fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
   'ngrok-skip-browser-warning': 'true'
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Server error");
        return data;
      })
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load orders.");
        setLoading(false);
      });
  }, [token, searchParams, API_BASE_URL]);

  const handleUserCancel = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في إلغاء الطلب؟")) return;

    setIsCancelling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      if (data.success) {
        // تحديث الطلب في القائمة بدلاً من إعادة التحميل
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
      } else {
        alert(data.message || "لا يمكن إلغاء الطلب حالياً.");
      }
    } catch (err) {
      alert("حدث خطأ أثناء محاولة الإلغاء.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "delivered":
      case "completed":
        return { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 size={14} />, label: "مكتمل" };
      case "processing":
      case "confirmed":
        return { color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: <Clock size={14} />, label: "قيد التنفيذ" };
      case "pending": // حالة انتظار دفع فوري
        return { color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: <Loader2 size={14} className="animate-spin" />, label: "بانتظار الدفع" };
      case "shipped":
        return { color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", icon: <Package size={14} />, label: "تم الشحن" };
      case "cancelled":
        return { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle size={14} />, label: "ملغي" };
      default:
        return { color: "text-gray-400 bg-gray-500/10 border-gray-500/20", icon: <AlertCircle size={14} />, label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 px-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-zinc-900 animate-pulse rounded-[2rem] border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans" dir="rtl">
      <div className="container mx-auto max-w-5xl">
        
        {/* الهيدر */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">سجل الطلبات</h1>
            <p className="text-gray-500">مشروع MyShop - تتبع مشترياتك</p>
          </div>
          <div className="bg-zinc-900/50 px-6 py-3 rounded-2xl border border-white/5 text-sm font-bold text-blue-500">
            إجمالي الطلبات: {orders.length}
          </div>
        </div>

        {/* تنبيه نجاح الدفع */}
        {searchParams.get('status') === 'success' && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <p className="font-bold">تم تأكيد الدفع بنجاح! طلبك الآن تحت المراجعة.</p>
          </div>
        )}

        {error ? (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/30 rounded-[3rem] border border-white/5">
            <ShoppingBag size={64} className="mx-auto mb-6 text-gray-700" />
            <h2 className="text-2xl font-bold mb-4">لا توجد طلبات حتى الآن</h2>
            <Link to="/" className="text-blue-500 hover:underline font-bold">ابدأ التسوق الآن</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusDetails(order.status);
              
              // ✅ المنطق البرمجي لإظهار كود فوري:
              // يظهر الكود إذا كانت الطريقة فوري والحالة انتظار (pending)
              const fawryCode = (order.payment_method === 'fawry' && order.status === 'pending')
                                ? order.payment_reference
                                : null;

              // ✅ منطق إظهار معلومات الدفع المعلق
              const showPendingPayment = order.status === 'pending' && ['credit_card', 'fawry', 'wallet'].includes(order.payment_method);

              return (
                <div key={order.id} className="group relative bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] transition-all hover:bg-zinc-900/60 hover:border-blue-500/30 backdrop-blur-sm">
                  <div className="flex flex-col gap-6">
                    
                    {/* معلومات الطلب العلوية */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <Package size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black mb-1">طلب رقم #{order.order_number || order.id}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                              <span className="flex items-center gap-1"><CreditCard size={14} /> {order.total} ج.م</span>
                              <span className="border-r border-white/10 pr-3 mr-1 font-bold text-gray-400 capitalize">{order.payment_method}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
                            {status.icon} {status.label}
                          </div>
                          <Link to={`/order/${order.id}`} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                            <ChevronLeft size={20} />
                          </Link>
                          {order.can_be_cancelled && (
                             <button onClick={() => handleUserCancel(order.id)} disabled={isCancelling} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                <XCircle size={20} />
                             </button>
                          )}
                        </div>
                    </div>

                    {/* ✅ جزء كود فوري: يظهر فقط إذا كان متاحاً في الـ Response */}
                    {fawryCode && (
                      <div className="bg-blue-600/10 border border-blue-600/20 p-6 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-600 rounded-xl">
                            <Hash size={24} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">كود دفع فوري</p>
                            <p className="text-3xl font-black tracking-[0.3em]">{fawryCode}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => { navigator.clipboard.writeText(fawryCode); alert("تم نسخ الكود"); }}
                          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all"
                        >
                          <Copy size={14} /> نسخ الكود
                        </button>
                      </div>
                    )}

                    {/* ✅ معلومات الدفع المعلق لجميع طرق الدفع */}
                    {showPendingPayment && (
                      <div className="bg-amber-600/10 border border-amber-600/20 p-6 rounded-[1.5rem] flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-amber-600 rounded-xl">
                            <AlertCircle size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-amber-400 font-bold uppercase tracking-widest">انتظار الدفع</p>
                            <p className="text-white font-bold">يجب إتمام الدفع خلال 48 ساعة</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {order.payment_method === 'credit_card' && "يرجى إتمام الدفع عبر البطاقة الائتمانية"}
                              {order.payment_method === 'fawry' && "يرجى الدفع عبر أي منفذ فوري باستخدام الكود أعلاه"}
                              {order.payment_method === 'wallet' && "يرجى إتمام الدفع عبر المحفظة الإلكترونية"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 bg-black/20 p-3 rounded-xl">
                          <span>ينتهي الصلاحية:</span>
                          <span className="font-bold text-amber-400">
                            {new Date(new Date(order.created_at).getTime() + 48 * 60 * 60 * 1000).toLocaleString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;