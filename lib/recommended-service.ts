import { getSelf } from '@/lib/auth-service'
import { db } from '@/lib/db'

export const getRecommended = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 5000))

  let userId
  try {
    const self = await getSelf()
    userId = self.id
  } catch {
    userId = null
  }
  let users = []

  if (userId) {
    users = await db.user.findMany({
      where: {
        id: { not: userId }, // Exclude the current user

        followedBy: {
          none: { followerId: userId },
        },
        blocking: {
          none: {
            blockedId: userId,
          },
        },
      },
      include: {
        stream: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } else {
    users = await db.user.findMany({
      include: {
        stream: {
          select: {
            isLive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
  return users
}
