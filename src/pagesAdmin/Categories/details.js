import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AdminCategoriesDetails() {
    const { id } = useParams();
    const [categories, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/categories/${id}`)
            .then(res => res.json())
            .then(data => {
                setCategory(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="p-6 text-xl">Loading...</p>;
    return (
        <div className="p-6 max-w-xl mx-auto border border-blue-800">
            <h1 className="font-bold text-3xl mb-4">{categories.name}</h1>
            <p className="mb-2">${categories.slug}</p>
            <p className="mb-4">{categories.description}</p>
            <p className="mb-6">
                {categories.parent
                    ? `Parent: ${categories.parent.name}`
                    : "فئة رئيسية"}
            </p>
        </div>
    );
}