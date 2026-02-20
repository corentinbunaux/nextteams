"use client"

import { useEffect, useState } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { getFirebaseMessaging } from "@/lib/firebase-client"

export default function NotificationComponent() {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const messaging = await getFirebaseMessaging()
        if (!messaging) {
          console.log("Messaging non supporté")
          return
        }

        const permissionResult = await Notification.requestPermission()
        setPermission(permissionResult)

        if (permissionResult !== "granted") {
          console.log("Permission refusée")
          return
        }

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })

        if (!currentToken) {
          console.log("Aucun token reçu")
          return
        }

        console.log("Token :", currentToken)
        setToken(currentToken)

        onMessage(messaging, (payload) => {
          console.log("Message reçu (foreground) :", payload)

          if (payload.notification) {
            new Notification(payload.notification.title ?? "Notification", {
              body: payload.notification.body,
            })
          }
        })

      } catch (error) {
        console.error("Erreur FCM:", error)
      }
    }

    init()
  }, [])

  const sendNotification = async () => {
    if (!token) return

    try {
      setLoading(true)

      const res = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: "🔥 Test depuis le frontend",
          body: "La notification fonctionne parfaitement !",
        }),
      })

      const data = await res.json()
      console.log("Réponse backend :", data)

    } catch (error) {
      console.error("Erreur envoi :", error)
    } finally {
      setLoading(false)
    }
  }

  const askPermission = async () => {
    const messaging = await getFirebaseMessaging()
    if (!messaging) return

    const permission = await Notification.requestPermission()
    setPermission(permission)

    if (permission !== "granted") return

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    })

    setToken(currentToken)
  }

  return (
    <div>
      <p>Notifications activées</p>
      <p>Permission : {permission}</p>
      <p>Token : {token ? "Reçu ✅" : "Non reçu ❌"}</p>

      <button
        onClick={sendNotification}
        disabled={!token || loading}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        {loading ? "Envoi..." : "Envoyer une notification test"}
      </button>
      {showPopup && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 8
        }}>
          <p>🔔 Active les notifications </p>
          <button className="cursor-pointer"
            onClick={askPermission}
            style={{ marginTop: 10 }}
          >
            Activer
          </button>
        </div>
      )}
    </div>
  )
}