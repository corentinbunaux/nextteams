"use client"

import { useState } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { getFirebaseMessaging } from "@/lib/firebase-client"

export default function NotificationComponent() {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)

  const askPermissionAndGetToken = async () => {
    try {
      const messaging = await getFirebaseMessaging()
      if (!messaging) return alert("Messaging non supporté")

      // 1️⃣ Demande permission
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result !== "granted") return alert("Notifications refusées")

      // 2️⃣ Enregistre SW si pas fait
      let registration = await navigator.serviceWorker.getRegistration("/")
      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        )
      }

      await navigator.serviceWorker.ready

      // 3️⃣ Récupère token FCM
      const firebaseToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration,
      })

      if (!firebaseToken) return alert("Impossible de récupérer le token")
      setToken(firebaseToken)
      console.log("Token FCM :", firebaseToken)

      // 4️⃣ Listener foreground
      onMessage(messaging, (payload) => {
        console.log("Message reçu :", payload)
        if (payload.notification) {
          new Notification(payload.notification.title ?? "Notification", {
            body: payload.notification.body,
          })
        }
      })

    } catch (err) {
      console.error("Erreur notifications :", err)
    }
  }

  const sendNotification = async () => {
    if (!token) return alert("Token non disponible")

    const res = await fetch("/api/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        title: "🔥 Test depuis iPhone",
        body: "Notifications fonctionnent !",
      }),
    })
    const data = await res.json()
    console.log("Réponse backend :", data)
  }

  return (
    <div>
      <p>Permission : {permission}</p>
      <p>Token : {token ? "Reçu ✅" : "Non reçu ❌"}</p>

      {!token && (
        <button onClick={askPermissionAndGetToken}>
          Activer notifications
        </button>
      )}

      {token && (
        <button onClick={sendNotification}>
          Envoyer une notification test
        </button>
      )}
    </div>
  )
}