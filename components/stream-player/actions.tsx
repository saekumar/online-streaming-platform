'use client'

import { useAuth } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { onFollow, onUnfollow } from '@/actions/follow'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'

interface ActionsProps {
  hostIdentity: string
  isFollowing: boolean
  isHost: boolean
}

export const Actions = ({
  hostIdentity,
  isHost,
  isFollowing,
}: ActionsProps) => {
  const [isPending, startTransition] = useTransition()

  const handleFollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => `Something went wrong`)
    })
  }
  const handleUnfollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then((data) =>
          toast.success(`You have  unfollowed ${data.following.username}`)
        )
        .catch(() => `Something went wrong`)
    })
  }
  const router = useRouter()
  const toggleFollow = () => {
    if (!userId) {
      return router.push('/sign-in')
    }
    if (isHost) {
      return
    }
    if (isFollowing) {
      handleUnfollow()
    } else {
      handleFollow()
    }
  }
  const { userId } = useAuth()
  return (
    <Button
      onClick={toggleFollow}
      disabled={isPending || isHost}
      variant="primary"
      size="sm"
      className="w-fit lg:w-auto"
    >
      <Heart
        className={cn('h-4 w-4 mr-2', isFollowing ? 'fill-white' : 'fill-none')}
      />
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export const ActionsSkeleton = () => {
  return <Skeleton className="h-10 w-full lg:w-24"></Skeleton>
}
