const addToCart = async (productId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("يجب تسجيل الدخول أولاً");
    return;
  }

  try {
    const response = await fetch("https://marisa-nonretired-willis.ngrok-free.dev/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // مهم جداً
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert("خطأ أثناء الإضافة للسلة");
      return;
    }

    alert("تمت الإضافة للسلة ✔");
  } catch (error) {
    console.error("Request error:", error);
    alert("تعذر الاتصال بالسيرفر");
  }
};
export default addToCart;