import { db } from '@/lib/db'
import { getSelf } from '@/lib/auth-service'

interface StreamWhereClause {
  OR: (
    | {
        name: { contains: string | undefined }
        user?: undefined
      }
    | {
        user: {
          username: { contains: string | undefined }
          NOT?: {
            blocking: {
              some: {
                blockedId: string
              }
            }
          }
        }
        name?: undefined
      }
  )[]
}

export const getSearch = async (term?: string) => {
  try {
    const self = await getSelf()
    const userId = self.id

    const streams = await getStreamsByUserId(userId, term)
    console.log(streams)
    return streams
  } catch (error) {
    const streams = await getStreamsByUserId(null, term)
    console.log(streams)
    return streams
  }
}

const getStreamsByUserId = async (userId: string | null, term?: string) => {
  const whereClause: StreamWhereClause = {
    OR: [
      { name: { contains: term } },
      {
        user: {
          username: { contains: term },
          NOT: userId
            ? {
                blocking: {
                  some: {
                    blockedId: userId,
                  },
                },
              }
            : undefined,
        },
      },
    ],
  }

  const streams = await db.stream.findMany({
    where: whereClause,
    select: {
      user: true,
      id: true,
      name: true,
      isLive: true,
      thumbnailUrl: true,
      updatedAt: true,
    },
    orderBy: [{ isLive: 'desc' }, { updatedAt: 'desc' }],
  })

  return streams
}
