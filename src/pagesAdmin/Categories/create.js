import { useState } from "react";
import Sidebar from "../../components/sidebar";

export default function AdminCreateCategory() {
    const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [parent, setParent] = useState("");
  

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found! Please login.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
         formData.append("slug", slug || name.replace(/\s+/g, "-").toLowerCase());
        formData.append("description", description);
        formData.append("parent", parent);

   
        formData.append("sku", "SKU-" + Date.now());

        try {
            const res = await fetch("https://marisa-nonretired-willis.ngrok-free.dev/api/categories", {
              
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

            alert("category Created Successfully");
            // إعادة تعيين الحقول بعد الإنشاء
            setName("");
            setDescription("");
         setParent("");
            setSlug("");
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Fetch error: " + err.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <form onSubmit={handleSubmit} className="p-6 max-w-xl h-full w-full grid gap-4">
        
                <input className="border"   id="product-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="border p-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                <textarea className="border" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input className="border" placeholder="parent" value={parent} onChange={(e) => setParent(e.target.value)} />

                <button className="bg-blue-500 text-white p-2 rounded">Create</button>
            </form>
        </div>
    );
}
