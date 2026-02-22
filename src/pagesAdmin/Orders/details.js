import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Package, User, MapPin, CreditCard, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminOrdersDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // جلب التوكن الخاص بالأدمن
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  // الحالات المسموح بها للطلب
  const orderStatuses = ["draft", "confirmed", "processing", "shipped", "delivered", "completed", "cancelled"];

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`https://marisa-nonretired-willis.ngrok-free.dev/api/orders/${id}`, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
      });
      if (res.data.success) {
        setOrder(res.data.order);
      }
      setLoading(false);
    } catch (err) {
      toast.error("فشل في جلب تفاصيل الطلب");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id, token]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await axios.patch(
        `https://marisa-nonretired-willis.ngrok-free.dev/api/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("تم تحديث الحالة");
        setOrder({ ...order, status: newStatus });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "الحالة غير مسموح بها");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#050505]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  if (!order) return <p className="p-10 text-center text-zinc-500">الطلب غير موجود</p>;

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 text-right text-white" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/5 pb-6 gap-4">
          <div>
            <button 
              onClick={() => navigate("/admin/orders")}
              className="flex items-center gap-2 text-zinc-500 hover:text-white mb-2 transition-colors text-sm font-bold"
            >
              <ArrowRight size={18} /> العودة للطلبات
            </button>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Package className="text-blue-500" size={32} /> طلب #{order.order_number || order.id}
            </h1>
            <p className="text-zinc-500 text-xs mt-1">تاريخ الإنشاء: {new Date(order.created_at).toLocaleString('ar-EG')}</p>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">تحديث الحالة</label>
             <select 
               disabled={updating}
               value={order.status}
               onChange={(e) => handleStatusChange(e.target.value)}
               className="bg-zinc-800 border border-white/10 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all cursor-pointer"
             >
                {orderStatuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* محتويات الطلب */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="font-bold flex items-center gap-2"><Package size={20} className="text-blue-500"/> المنتجات المطلوبة</h3>
              </div>
              <div className="divide-y divide-white/5">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-6 flex justify-between items-center hover:bg-white/5 transition">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-blue-500 border border-white/5">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-white">{item.product_name || item.product?.name}</p>
                        <p className="text-xs text-zinc-500">سعر الوحدة: {item.price} ج.م</p>
                      </div>
                    </div>
                    <p className="font-black text-blue-500">{item.price * item.quantity} ج.م</p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-blue-600 flex justify-between items-center">
                <span className="font-black text-white text-lg">إجمالي الفاتورة</span>
                <span className="text-2xl font-black text-white">{order.total} ج.م</span>
              </div>
            </div>
          </div>

          {/* العميل والدفع */}
          <div className="space-y-6">
            
            {/* بطاقة العميل */}
            <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-tighter text-sm">
                <User size={18} className="text-blue-500"/> معلومات الشحن
              </h3>
              <div className="space-y-4">
                <div>
                    <p className="text-xs text-zinc-500 mb-1">العميل:</p>
                    <p className="text-sm font-bold">{order.shipping_name}</p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">الهاتف:</p>
                    <p className="text-sm font-bold">{order.shipping_phone}</p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">العنوان:</p>
                    <p className="text-xs text-zinc-400 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed">
                        {order.shipping_address}, {order.shipping_city}, {order.shipping_state}
                    </p>
                </div>
              </div>
            </div>

            {/* بطاقة الدفع */}
            <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-tighter text-sm">
                <CreditCard size={18} className="text-blue-500"/> تفاصيل المالية
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">حالة الدفع:</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                    {order.payment_status === 'paid' ? 'تم الدفع' : 'قيد الانتظار'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">وسيلة الدفع:</span>
                  <span className="text-xs font-bold text-white uppercase">{order.payment_method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">رقم المعاملة:</span>
                  <span className="text-[10px] font-mono text-zinc-400">{order.transaction_id || "N/A"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {updating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
      )}
    </div>
  );
}