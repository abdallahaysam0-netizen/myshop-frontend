import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/footer'; 
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from "./context/userContext";
import { useContext } from 'react';
// استيراد الصفحات (نفس المسارات الخاصة بك)
import HomePage from './pagesUser/HomePage';
import ProductsPage from './pagesUser/productPage';
import ProductDetails from './pagesUser/ProductsDatails';
import CategoriesPage from './pagesUser/CategoriesPage';
import CartPage from './pagesUser/Cartpage';
import CheckoutPage from './pagesUser/CheckoutPage';
import DetailsOrderPage from './pagesUser/DetailsOrder';
import OrderPage from './pagesUser/OrderPage';
import LoginPage from './pagesUser/LoginPage';
import CustomerRegisterPage from './pagesUser/RegisterPage';
import CategoryProduct from './pagesUser/CategoryProductsPages';
// 1️⃣ استيراد الـ Context والـ Hook الجديد
import { UserContext } from './context/userContext';
// صفحات الأدمن
import AdminDashboard from './pagesAdmin/Admin Dashboard';
import AdminProducts from './pagesAdmin/Products/admin Products';
import ProductAdminDetails from './pagesAdmin/Products/details';
import AdminCreateProduct from './pagesAdmin/Products/create';
import AdminEditProduct from './pagesAdmin/Products/edit';
import AdminCategory from './pagesAdmin/Categories/admin Categories';
import AdminCategoriesDetails from './pagesAdmin/Categories/details';
import AdminCreateCategory from './pagesAdmin/Categories/create';
import AdminEditCategory from './pagesAdmin/Categories/edit';
import AdminOrders from './pagesAdmin/Orders/admin Orders';
import AdminOrdersDetails from './pagesAdmin/Orders/details';
import AdminUsers from './pagesAdmin/Users/admin Users';
import AdminCreateUser from './pagesAdmin/Users/create User';
import useNotifications from './hooks/useNotifications';
import OfferPage from './pagesUser/OfferPage';
import axios from 'axios';
// السطر ده هيخلي أي طلب يطلع من الـ React يروح للـ Backend ومعاه الـ "تصريح"
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

function App() {
  // 2️⃣ استدعاء المستخدم من السياق
  // تأكد أن userContext يوفر كائن user يحتوي على id
  const { user } = useContext(UserContext); 

  // 3️⃣ تشغيل نظام الإشعارات (سيعمل فقط إذا كان المستخدم مسجلاً)
  useNotifications(user);
  return (
    <UserProvider>
      {/* 1. flex flex-col: تجعل العناصر تترتب عمودياً.
          2. min-h-screen: تجعل طول الصفحة لا يقل عن طول شاشة المتصفح.
          3. bg-[#050505]: توحيد الخلفية مع التصميم المظلم.
      */}
      <div className="flex flex-col min-h-screen bg-[#050505] text-white">
        
        <Navbar />

        {/* flex-grow: تجعل هذا الجزء يأخذ كل المساحة المتاحة في المنتصف، 
            مما يجبر الـ Footer على البقاء في الأسفل دائماً.
        */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order/:id" element={<DetailsOrderPage />} />
            <Route path="/customer/login" element={<LoginPage />} />
            <Route path="/customer/register" element={<CustomerRegisterPage />} />
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/products' element={<AdminProducts/>}/>
            <Route path='/admin/products/details/:id' element={<ProductAdminDetails/>}/>
            <Route path='admin/products/create' element={<AdminCreateProduct/>}/>
            <Route path='/admin/products/edit/:id' element={<AdminEditProduct/>}/>
            <Route path='/admin/categories' element={<AdminCategory/>}/>
            <Route path='/admin/categories/details/:id'element={<AdminCategoriesDetails/>}/>
            <Route path='/admin/categories/create' element={<AdminCreateCategory/>}/>
            <Route path='/admin/categories/edit/:id'element={<AdminEditCategory/>}/>
            <Route path='/admin/orders' element={<AdminOrders/>}/>
            <Route path='/admin/orders/:id'element={<AdminOrdersDetails/>}/>
            <Route path='/admin/users' element={<AdminUsers/>}/>
            <Route path='/create/users' element={<AdminCreateUser/>}/>
            <Route path="/categories/:id" element={<CategoryProduct/>}/> 
            <Route path='/offer'element={<OfferPage/>}/>
            
          </Routes>
        </main>

        <Footer />
      </div>
    </UserProvider>
  
  );

}

export default App;