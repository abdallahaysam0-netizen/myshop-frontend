import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Cell 
} from "recharts";
import { DollarSign, ShoppingBag, Box, TrendingUp, Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        sales: 0,
        orders: 0,
        products: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://127.0.0.1:8000/api/admin/stats", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
            }
        })
        .then(async res => {
            const data = await res.json();
            setStats({
                sales: data.sales || 0,
                orders: data.orders || 0,
                products: data.products || 0,
            });
            setChartData(data.monthlySales || []);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching stats:", err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
            {/* القائمة الجانبية */}
            <Sidebar />

            {/* المحتوى الرئيسي */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
                {/* خلفية ضوئية ديكورية */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

                {/* الهيدر */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">لوحة التحكم</h1>
                        <p className="text-gray-500 font-medium">نظرة عامة على أداء متجرك اليوم</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 text-sm font-bold">
                        <TrendingUp size={18} />
                        تحديث مباشر
                    </div>
                </div>

                {/* البطاقات الإحصائية (Top Stats) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <StatCard 
                        title="إجمالي المبيعات" 
                        value={`${stats.sales} ج.م`} 
                        icon={<DollarSign size={24} />} 
                        color="text-blue-500" 
                        bgColor="bg-blue-500/10"
                    />
                    <StatCard 
                        title="إجمالي الطلبات" 
                        value={stats.orders} 
                        icon={<ShoppingBag size={24} />} 
                        color="text-purple-500" 
                        bgColor="bg-purple-500/10"
                    />
                    <StatCard 
                        title="إجمالي المنتجات" 
                        value={stats.products} 
                        icon={<Box size={24} />} 
                        color="text-amber-500" 
                        bgColor="bg-amber-500/10"
                    />
                </div>

                {/* المخطط البياني (Chart Section) */}
                <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight">تحليلات المبيعات الشهرية</h2>
                        <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500/50 transition-all">
                            <option>آخر 6 أشهر</option>
                            <option>هذا العام</option>
                        </select>
                    </div>

                    <div className="w-full h-[350px]">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="animate-spin text-blue-500" size={32} />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#71717a', fontSize: 12 }} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{ 
                                            backgroundColor: '#18181b', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="sales" radius={[10, 10, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#27272a'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// مكون فرعي للبطاقات الإحصائية
function StatCard({ title, value, icon, color, bgColor }) {
    return (
        <div className="group relative bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] transition-all duration-500 hover:bg-zinc-900/60 hover:-translate-y-1 hover:border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${bgColor} ${color} transition-transform group-hover:scale-110 duration-500`}>
                    {icon}
                </div>
                <div className="h-1 w-10 bg-zinc-800 rounded-full group-hover:bg-blue-500/50 transition-all" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-3xl font-black tracking-tight">{value}</p>
        </div>
    );
}