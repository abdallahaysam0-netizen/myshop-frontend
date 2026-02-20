import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // جلب بيانات التصنيف
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && data.status === "success") {
          setCategory(data.data);
        } else {
          alert("Failed to fetch category: " + (data.message || "Unknown error"));
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching category: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCategory();
  }, [id, token]);

  // تعديل التصنيف
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !category) return;

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    formData.append("description", category.description);
    formData.append("parent_id", category.parent_id);
    formData.append("is_active", category.is_active ? 1 : 0); // لو هتعدل الحالة

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        alert("Category updated successfully!");
        navigate("/admin/categories");
      } else {
        alert("Error updating category: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error updating category: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found!</p>;

  return (
    <div className="flex">
      <Sidebar />

      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-xl w-full grid gap-4"
      >
        <input
          className="border p-2"
          placeholder="Name"
          value={category.name}
          onChange={(e) =>
            setCategory({
              ...category,
              name: e.target.value,
              slug: e.target.value.replace(/\s+/g, "-").toLowerCase(),
            })
          }
        />

        <input
          className="border p-2"
          placeholder="Slug"
          value={category.slug}
          onChange={(e) =>
            setCategory({ ...category, slug: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Parent_id"
          value={category.parent_id || ""}
          onChange={(e) =>
            setCategory({ ...category, parent_id: e.target.value })
          }
        />
     <input
    type="checkbox"
    checked={category.is_active || false}
    onChange={(e) =>
      setCategory({ ...category, is_active: e.target.checked })
    }
  />
    
        <textarea
          className="border p-2"
          placeholder="Description"
          value={category.description || ""}
          onChange={(e) =>
            setCategory({ ...category, description: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          تعديل
        </button>
      </form>
    </div>
  );
}
