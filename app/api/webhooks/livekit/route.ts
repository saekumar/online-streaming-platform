import { headers } from 'next/headers'
import { WebhookReceiver } from 'livekit-server-sdk'

import { db } from '@/lib/db'

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = headers()
  const authorization = headerPayload.get('Authorization')

  if (!authorization) {
    return new Response('No authorization header', { status: 400 })
  }
  const event = receiver.receive(body, authorization)

  if (event.event === 'ingress_started' || event.event === 'ingress_ended') {
    const ingressId = event.ingressInfo?.ingressId

    if (!ingressId) {
      return new Response('No ingressId provided in the event', { status: 400 })
    }

    // Update streams where ingressId matches
    await db.stream.updateMany({
      where: {
        ingressId: ingressId,
      },
      data: {
        isLive: event.event === 'ingress_started', // Adjust based on event type
      },
    })
  }
}
