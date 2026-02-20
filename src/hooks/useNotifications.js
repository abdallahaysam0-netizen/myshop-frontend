import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const useNotifications = (user) => {
    useEffect(() => {
        // 1. التحقق من وجود ID حقيقي (وليس مجرد نص 'undefined' أو null)
        const userId = user?.id || localStorage.getItem("user_id");
        
        if (!userId || userId === 'null' || userId === 'undefined') {
            // لا نطبع تحذير هنا لتجنب إزعاجك في الكونسول عند كل تحديث، 
            // التطبيق ببساطة سينتظر تسجيل الدخول.
            return;
        }

        // 2. جلب التوكن (تأكد أن الاسم مطابق لما في LoginPage)
        // إذا كنت استخدمت ACCESS_TOKEN أو token، تأكد من توحيدهما هنا
        const token = localStorage.getItem('token') || localStorage.getItem('ACCESS_TOKEN');

        if (!token) {
            console.error("⚠️ لم يتم العثور على توكن المصادقة، لن يعمل البث الخاص.");
            return;
        }

        // 3. إعداد Echo للعمل مع Laravel Reverb
        const echo = new Echo({
            broadcaster: 'reverb',
            key: '35lnv77uu0ch1j7cnnie', 
            wsHost:'127.0.0.1', 
            wsPort: 8080,
            wssPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: 'http://localhost:8000/broadcasting/auth', 
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            }
        });

        // 4. الاستماع للقناة الخاصة
        const channelName = `App.Models.User.${userId}`;
        console.log('✅ Listening to:', channelName);

        echo.private(channelName)
            .notification((data) => {
                console.log('🔔 إشعار جديد:', data);
                // يمكنك هنا إضافة مكتبة مثل react-hot-toast لإظهار تنبيه منبثق
                if (window.Notification && Notification.permission === "granted") {
                    new Notification("إشعار جديد من MyShop", { body: data.message });
                }
            });

        // 5. تنظيف الاتصال عند مغادرة الصفحة أو تسجيل الخروج
        return () => {
            console.log(`🔌 Leaving channel: ${channelName}`);
            echo.disconnect();
        };

    }, [user?.id]); // سيعيد الاتصال تلقائياً بمجرد تغير ID المستخدم (مثلاً بعد تسجيل الدخول)
};

export default useNotifications;