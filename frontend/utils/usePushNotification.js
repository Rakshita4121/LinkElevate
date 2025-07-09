import axios from "axios";

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Main function
export async function subscribeUserToPush(token) {
  if (!token) {
    console.warn("⚠️ No token found for user");
    return;
  }

  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("❌ Notification permission not granted");
        return;
      }

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });
        console.log("📌 New subscription created");
      } else {
        console.log("📌 Existing subscription found");
      }

      // Always send to backend — ties subscription to current user
      console.log("📤 Sending subscription to backend");
      await axios.post("http://localhost:9090/subscribe", {
        subscription,
        token
      }, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("✅ Subscription sent to backend");
    } catch (err) {
      console.error("❌ Error subscribing to push:", err);
    }
  } else {
    console.warn("❌ Push messaging not supported in this browser");
  }
}
