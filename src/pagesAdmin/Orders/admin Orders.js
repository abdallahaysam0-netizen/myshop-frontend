import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/sidebar";
import axios from "axios";
import { 
  Package, User, MapPin, CreditCard, Clock, 
  Loader2, Wallet, Smartphone, Banknote, AlertCircle
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem("token");

  // الحالات المتوافقة مع الـ Enums في الـ Backend
  const orderStatuses = ["draft", "confirmed", "processing", "shipped", "delivered", "completed", "cancelled"];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://marisa-nonretired-willis.ngrok-free.dev/api/orders", {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true" 
        },
      });
      if (res.data.success) setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, value) => {
    if (value === "cancelled") {
      const confirmCancel = window.confirm("هل أنت متأكد من إلغاء الطلب؟ سيتم استرداد المبلغ تلقائياً.");
      if (!confirmCancel) return;
      await handleCancelProcess(orderId);
      return;
    }

    try {
      const res = await axios.patch(
        `https://marisa-nonretired-willis.ngrok-free.dev/api/orders/${orderId}/status`,
        { status: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: value } : o)));
      }
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ في التحديث");
      fetchOrders();
    }
  };

  const handleCancelProcess = async (orderId) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(
        `https://marisa-nonretired-willis.ngrok-free.dev/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        fetchOrders(); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "فشل عملية الإلغاء");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed": case "confirmed": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "cancelled": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "draft": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "processing": case "shipped": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-400 bg-zinc-800 border-white/5";
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'visa': return <CreditCard size={16} />;
      case 'fawry': return <Smartphone size={16} />;
      case 'wallet': return <Wallet size={16} />;
      case 'cod': return <Banknote size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden" dir="rtl">
      
      {/* 1. المحتوى الرئيسي (سيبدأ من اليمين بفضل dir="rtl") */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative h-screen border-l border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">إدارة الطلبات</h1>
              <p className="text-gray-500 font-medium italic">MyShop Control Center</p>
            </div>
            <div className="flex gap-4">
               <SummaryBadge label="إجمالي الطلبات" count={orders.length} color="blue" />
               <SummaryBadge label="قيد الدفع" count={orders.filter(o => o.status === 'draft').length} color="amber" />
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
              <p className="text-gray-500 italic">جاري تحميل بيانات MyShop...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {orders.map((order) => (
                <div key={order.id} className="group bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden transition-all hover:border-blue-500/30">
                  
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 border border-blue-500/20">
                              <Package size={24} />
                          </div>
                          <div>
                              <h2 className="text-xl font-black tracking-tight tracking-tighter">ORDER #{order.id}</h2>
                              <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 uppercase">
                                  <Clock size={12} /> {new Date(order.created_at).toLocaleString('ar-EG')}
                              </span>
                          </div>
                      </div>
                      <div className="text-left">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Total Amount</p>
                          <span className="text-2xl font-black text-blue-500">{order.total} <span className="text-xs">EGP</span></span>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4 text-right">
                          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center justify-end gap-2 text-right">
                               العميل <User size={14} />
                          </h3>
                          <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                              <p className="font-bold text-white mb-1 text-sm">{order.shipping_name}</p>
                              <p className="text-[10px] text-gray-500 font-medium tracking-wider">{order.shipping_phone}</p>
                          </div>
                      </div>
                      <div className="space-y-4 text-right">
                          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center justify-end gap-2">
                               عنوان الشحن <MapPin size={14} />
                          </h3>
                          <div className="bg-black/20 p-4 rounded-2xl border border-white/5 h-full">
                              <p className="text-[10px] text-gray-400 font-medium leading-relaxed line-clamp-2 text-right">
                                  {order.shipping_address}, {order.shipping_city}
                              </p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div className="space-y-2 text-right">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">تحديث الحالة</label>
                          <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`w-full p-3 rounded-xl border text-xs font-black outline-none appearance-none transition-all cursor-pointer text-center ${getStatusStyle(order.status)}`}
                          >
                              {orderStatuses.map(s => <option key={s} value={s} className="bg-zinc-900 text-white font-bold">{s.toUpperCase()}</option>)}
                          </select>
                      </div>
                      
                      <div className="space-y-2 text-right">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-1">طريقة الدفع</label>
                          <div className="w-full p-3 rounded-xl border border-white/5 bg-zinc-800/50 flex items-center justify-center gap-2 text-blue-400 font-black text-xs uppercase tracking-tighter">
                              {getPaymentIcon(order.payment_method)}
                              <span>{order.payment_method || 'N/A'}</span>
                              <span className="text-[10px] text-gray-600 mx-1">|</span>
                              <span className={order.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}>
                                {order.payment_status || 'PENDING'}
                              </span>
                          </div>
                      </div>
                  </div>

                  {isProcessing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[2.5rem]">
                          <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Processing...</p>
                      </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 2. الـ Sidebar (سيظهر الآن في جهة اليسار بفضل كونه العنصر الثاني في الترتيب) */}
      <Sidebar />
      
    </div>
  );
}

function SummaryBadge({ label, count, color }) {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    };
    return (
        <div className={`px-6 py-3 rounded-2xl border ${colors[color]} flex items-center gap-3 backdrop-blur-md`}>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none">{label}</span>
            <span className="text-xl font-black leading-none">{count}</span>
        </div>
    );
}