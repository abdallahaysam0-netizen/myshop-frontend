import { useContext } from "react";
import {UserContext} from "../context/userContext";
const LogoutPage=()=>{
const {setUser}=useContext(UserContext);
const handleLogout=async()=>{
try{
    const res=await fetch("https://marisa-nonretired-willis.ngrok-free.dev/api/customer/logout",{
        method:"POST",
  credentials: "include", // مهم لو Sanctum و Cookies
        headers:{
             "Content-Type":"application/json",
        }
    })
    if(res.ok){
     setUser(null); // مسح بيانات المستخدم من Context
        window.location.href = "/customer/login"; // إعادة توجيه للصفحة
    }
} catch(error){
   alert(`فشل تسجيل الخروج: ${error}`);
}
};
 return <button  className="text-2xl border bg-red-600 font-bold p-4"onClick={handleLogout}>Logout</button>;
}
export default LogoutPage;