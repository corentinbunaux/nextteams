import { NextResponse } from "next/server"
import webPush from "web-push"

webPush.setVapidDetails(
  "mailto:tonemail@exemple.com",
  process.env.NEXT_PUBLIC_VAPID_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
)

export async function POST(req: Request) {
  const body = await req.json()
  try {
    await webPush.sendNotification(body.subscription, JSON.stringify({
      title: body.title || "Nouvelle notification",
      body: body.body || "Message push iPhone",
      url: body.url || "/"
    }))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 })
  }
}