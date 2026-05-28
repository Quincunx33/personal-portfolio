import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const trackVisitor = async () => {
  try {
    const hasTracked = sessionStorage.getItem("visitor_tracked");
    if (hasTracked) return;

    let data = null;
    try {
      const response = await fetch("https://ipapi.co/json/");
      data = response.ok ? await response.json() : null;
    } catch (fetchError) {
      console.warn("IP info fetch failed or blocked:", fetchError);
    }
    
    await addDoc(collection(db, "visitor_logs"), {
      ip: data?.ip || "Unknown IP",
      city: data?.city || "Unknown City",
      region: data?.region || "Unknown Region",
      country: data?.country_name || "Unknown Country",
      isp: data?.org || "Unknown ISP",
      timezone: data?.timezone || "Unknown Timezone",
      device: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timestamp: serverTimestamp()
    });

    sessionStorage.setItem("visitor_tracked", "true");
  } catch (error) {
    console.error("Tracking operation encountered a silent block:", error);
  }
};
