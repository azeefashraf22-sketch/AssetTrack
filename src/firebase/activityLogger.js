import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const logActivity = async (assetId, action, performedBy = "System") => {
  try {
    await addDoc(collection(db, "activityLogs"), {
      assetId,
      action,
      performedBy,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.log("Activity log error:", err.message);
  }
};