"use client"

import { useState } from "react"

export default function NotificationComponent() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  const askPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") return alert("Notifications refusées");

    const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;

    // 1️⃣ Supprimer subscription existante si elle existe
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      await existingSub.unsubscribe();
      console.log("Ancienne subscription supprimée");
    }

    // 2️⃣ Créer nouvelle subscription
    const newSub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY!)
    });

    setSubscription(newSub);

    // 3️⃣ Envoyer au backend
    const res = await fetch("/api/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: newSub })
    });
    if (!res.ok) return alert("Erreur lors de l'enregistrement de la subscription");
    alert("Notifications activées !");
  };

  return (
    <div>
      <p>Permission : {permission}</p>
      <button onClick={askPermission}>
        Activer notifications iPhone
      </button>
    </div>
  )
}

// Utilitaire pour convertir la clé VAPID
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}