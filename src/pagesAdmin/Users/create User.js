import { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import Sidebar from "../../components/sidebar";

export default function AdminCreateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found! Please login.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("type", type);


        try {
            const res = await fetch(`${API_BASE_URL}/admin/users`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true" // لتخطي شاشة ngrok
                },
                body: formData,
            });
            // قراءة الـ response بعد الـ fetch
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.log("Non-JSON response:", text);
                alert("Server returned non-JSON response. Check console.");
                return;
            }

            console.log("Response:", data);

            if (!res.ok) {
                alert("Error: " + JSON.stringify(data));
                return;
            }

            alert("User Created Successfully");
            // إعادة تعيين الحقول بعد الإنشاء
            setName("");
            setEmail("");
            setPassword("");
            setType("");
            ;
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Fetch error: " + err.message);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 lg:p-12 pt-20 lg:pt-12 overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
                <div className="max-w-xl mx-auto bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
                    <h2 className="text-3xl font-black mb-8 text-right text-blue-500 uppercase tracking-tight">إضافة مستخدم جديد</h2>
                    <form onSubmit={handleSubmit} className="grid gap-6 text-right" dir="rtl">


                        <input className="border" id="product-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" className="border" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input className="border p-2" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="border p-2">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="type"
                                    value="customer"
                                    checked={type === "customer"}
                                    onChange={(e) => setType(e.target.value)}
                                />
                                Customer
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="admin"
                                    checked={type === "admin"}
                                    onChange={(e) => setType(e.target.value)}
                                />
                                Admin
                            </label>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-lg shadow-blue-500/20">إنشاء الآن</button>
                    </form>
                </div>
            </main>
        </div>
    );
}
