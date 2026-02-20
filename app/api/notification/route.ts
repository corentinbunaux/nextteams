import { NextResponse } from "next/server"
import admin from "firebase-admin"

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT as string
  )

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export async function POST(req: Request) {
    const { token, title, body } = await req.json()

    try {
        await admin.messaging().send({
            token,
            notification: {
                title: title || "Nouvelle notification 🚀",
                body: body || "Quelqu'un a déclenché un POST",
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erreur envoi" }, { status: 500 })
    }
}