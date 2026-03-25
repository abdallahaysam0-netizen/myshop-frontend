# 🛍️ MyShop | متجري

[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-Backend-red.svg?style=flat-square&logo=laravel)](https://laravel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**MyShop** هو تطبيق متجر إلكتروني متكامل مبني باستخدام تقنيات حديثة لضمان تجربة مستخدم سلسة وأداء عالي. يتضمن المشروع واجهة للمستخدمين العاديين ولوحة تحكم شاملة للمسؤولين.

**MyShop** is a comprehensive e-commerce application built with modern technologies to ensure a seamless user experience and high performance. The project includes a user-facing interface and a robust admin dashboard.

---

## ✨ المميزات الرئيسية | Key Features

### 👤 واجهة المستخدم (User Interface)
- **الصفحة الرئيسية:** عرض المنتجات المميزة والعروض.
- **تصفح المنتجات:** تصنيف المنتجات والبحث المتقدم.
- **سلة التسوق:** إضافة وتعديل المنتجات بسهولة.
- **نظام الطلبات:** متابعة حالة الطلبات وتفاصيلها.
- **التوثيق:** نظام تسجيل دخول وإنشاء حساب (JWT/Session).
- **العروض:** صفحة مخصصة لأحدث الخصومات.

### 🔐 لوحة التحكم (Admin Dashboard)
- **إحصائيات ذكية:** رسوم بيانية تفاعلية (Recharts) لمتابعة المبيعات والمستخدمين.
- **إدارة المنتجات:** إضافة، تعديل، وحذف المنتجات.
- **إدارة الأقسام:** تنظيم المتجر من خلال نظام تصنيفات مرن.
- **إدارة الطلبات:** متابعة وتحديث حالة طلبات العملاء.
- **إدارة المستخدمين:** التحكم في صلاحيات وأدوار المستخدمين.

---

## 🛠️ التقنيات المستخدمة | Tech Stack

- **Frontend:** [React.js](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Context API
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
- **Real-time:** [Laravel Echo](https://laravel.com/docs/broadcasting) & [Pusher](https://pusher.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Backend (API):** Laravel (PHP)

---

## 🚀 التشغيل وكيفية التثبيت | Getting Started

### المتطلبات (Prerequisites)
- [Node.js](https://nodejs.org/) (v16+)
- [PHP](https://www.php.net/) & [Composer](https://getcomposer.org/) (للخلفية)

### التثبيت (Installation)

1. قم بتحميل المستودع (Clone the repo):
   ```bash
   git clone https://github.com/your-username/my-shop.git
   cd my-shop
   ```

2. تثبيت المكتبات (Install dependencies):
   ```bash
   npm install
   ```

3. تشغيل المشروع (Running the project):
   للبدء بتشغيل الواجهة الأمامية والخلفية ونفق ngrok في آن واحد:
   ```bash
   npm run dev-all
   ```
   أو لتشغيل الواجهة الأمامية فقط:
   ```bash
   npm start
   ```

---

## 📁 هيكلية المشروع | Project Structure

```text
src/
├── components/      # المكونات القابلة لإعادة الاستخدام
├── context/         # إدارة حالة التطبيق
├── hooks/           # الـ Hooks المخصصة
├── pagesUser/       # صفحات واجهة المستخدم
├── pagesAdmin/      # صفحات لوحة تحكم المسؤول
├── config/          # الإعدادات العامة
└── apiConfig.js     # إعدادات الروابط الخاصة بالـ API
```

---

## 📝 الترخيص | License

هذا المشروع مرخص بموجب رخصة [MIT](LICENSE).

---

تم التطوير بواسطة **[Abdallah Hatiham]** 🚀
Created with ❤️ for a better shopping experience.
