import { useState } from "react";
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
            const res = await fetch("https://marisa-nonretired-willis.ngrok-free.dev/api/admin/users", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
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
        <div className="flex">
            <Sidebar />
            <form onSubmit={handleSubmit} className="p-6 max-w-xl h-full w-full grid gap-4">


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
                <button className="bg-blue-500 text-white p-2 rounded">Create</button>
            </form>
        </div>
    );
}
