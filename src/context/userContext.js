// // src/context/UserContext.js
// import { createContext, useState } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
// // src/context/UserContext.js

//   const [userName, setUserName] = useState(localStorage.getItem("user_name") || "");
  
//   // تعديل: قراءة الرتبة من التخزين المحلي عند تشغيل التطبيق
//   const [userRole, setUserRole] = useState(localStorage.getItem("user_role") || null); 

//   return (
//     <UserContext.Provider value={{ userName, setUserName, userRole, setUserRole }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
// UserContext.js
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // الحالة الأساسية (قراءة من localStorage)
  const [userName, setUserName] = useState(localStorage.getItem("user_name") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("user_role") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);

  // ✅ أضفنا حالة الإشعارات هنا لتعمل في كل التطبيق
  const [notifications, setNotifications] = useState([]);

  // دالة تسجيل الخروج
  const logout = () => {
    localStorage.clear();
    setUserName(null);
    setUserRole(null);
    setUserId(null);
    setNotifications([]); // ✅ تنظيف الإشعارات عند الخروج
  };

  return (
    <UserContext.Provider value={{ 
      userName, setUserName, 
      userRole, setUserRole, 
      userId, setUserId,
      notifications,    // ✅ تم إضافتها للـ Provider
      setNotifications, // ✅ تم إضافتها للـ Provider (هذا يحل خطأ TypeError)
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};