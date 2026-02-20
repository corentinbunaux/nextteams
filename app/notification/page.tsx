"use client"

import { useEffect } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { getFirebaseMessaging } from "@/lib/firebase-admin"

export default function NotificationComponent() {

  useEffect(() => {

    const init = async () => {
      const messaging = await getFirebaseMessaging()
      if (!messaging) return

      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "TA_CLE_VAPID"
        })

        console.log("Token :", token)

        onMessage(messaging, (payload) => {
          console.log("Message reçu :", payload)
        })
      }
    }

    init()

  }, [])

  return <div>Notifications activées</div>
}
