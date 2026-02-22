import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Package, Calendar, Tag, CreditCard, CheckCircle2, Clock, Truck, Box } from "lucide-react";

const DetailsOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetch(`https://marisa-nonretired-willis.ngrok-free.dev/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrder(data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setLoading(false);
      });
  }, [id, token]);

  // تحديث الخطوات لتشمل الحالة المبدئية DRAFT
  const getStatusStep = (status) => {
    const steps = ["draft", "confirmed", "processing", "shipped", "delivered", "completed"];
    return steps.indexOf(status);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-bold mb-4">الطلب غير موجود</h2>
        <button onClick={() => navigate("/orders")} className="text-blue-500 hover:underline">العودة للطلبات</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6" dir="rtl">
      <div className="container mx-auto max-w-5xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-white/5 pb-8">
          <div>
            <button 
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors group text-sm font-bold"
            >
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              العودة لقائمة الطلبات
            </button>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-center gap-3">
              <Package className="text-blue-500" size={32} />
              طلب رقم #{order.order_number || order.id}
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <span className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-bold">تاريخ الطلب</span>
            <span className="font-bold flex items-center gap-2"><Calendar size={16} /> {new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        {/* شريط التتبع المعدل */}
        <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] mb-10 overflow-x-auto">
          <div className="flex justify-between items-center min-w-[600px] relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
            
            <TrackingStep icon={<Clock />} label="بانتظار الدفع" active={getStatusStep(order.status) >= 0} />
            <TrackingStep icon={<CheckCircle2 />} label="تم التأكيد" active={getStatusStep(order.status) >= 1} />
            <TrackingStep icon={<Box />} label="قيد التجهيز" active={getStatusStep(order.status) >= 2} />
            <TrackingStep icon={<Truck />} label="تم الشحن" active={getStatusStep(order.status) >= 3} />
            <TrackingStep icon={<Package />} label="مكتمل" active={getStatusStep(order.status) >= 5} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Tag size={20} className="text-blue-500" />
              محتويات الطلب
            </h2>
            
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-3xl hover:bg-zinc-900/60 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-500 border border-white/5">
                      <Box size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.product_name || item.product?.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">الكمية: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-lg font-black text-blue-500">{item.price} ج.م</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-blue-500/20 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-500" />
                ملخص الحساب
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span>{order.subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>الشحن</span>
                  <span>{order.shipping_cost === 0 || order.shipping_cost === "0.00" ? "مجاني" : `${order.shipping_cost} ج.م`}</span>
                </div>
                {/* إضافة حقل الضريبة هنا */}
                <div className="flex justify-between text-gray-400">
                  <span>الضريبة</span>
                  <span>{order.tax || 0} ج.م</span>
                </div>
                
                <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                  <span className="font-bold text-white">الإجمالي</span>
                  <span className="text-3xl font-black text-blue-500">{order.total} ج.م</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-500 leading-relaxed">
                <p>وسيلة الدفع: <span className="text-white font-bold capitalize">{order.payment_method}</span></p>
                <p className="mt-1">حالة الدفع: <span className="text-white font-bold capitalize">{order.payment_status}</span></p>
              </div>
            </div>

            <div className="bg-zinc-900/20 p-6 rounded-3xl border border-white/5">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">حالة الطلب</h4>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${order.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <span className="text-lg font-bold capitalize">{order.status}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingStep = ({ icon, label, active }) => (
  <div className="relative z-10 flex flex-col items-center gap-3">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
      active 
      ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
      : 'bg-zinc-900 border-zinc-800 text-gray-600'
    }`}>
      {icon}
    </div>
    <span className={`text-xs font-bold tracking-tight ${active ? 'text-white' : 'text-gray-600'}`}>
      {label}
    </span>
  </div>
);

export default DetailsOrderPage;