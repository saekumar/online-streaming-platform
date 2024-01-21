'use client'
import { onBlock, onUnblock } from '@/actions/block'
import { onUnfollow } from '@/actions/follow'
import { onFollow } from '@/actions/follow'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { toast } from 'sonner'
interface ActionsProps {
  isFollowing: boolean
  userId: string
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition()
  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error('Something went wrong'))
    })
  }
  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) => toast.success(`Blocked user ${data?.blocked.username}`))
        .catch(() => toast.error('Something went wrong'))
    })
  }
  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error('Something went wrong'))
    })
  }
  const onClick = () => {
    if (!isFollowing) {
      handleFollow()
    } else {
      handleUnfollow()
    }
  }
  return (
    <>
      <div className="">
        <Button disabled={isPending} onClick={onClick} variant="primary">
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      </div>
      <div className="">
        <Button variant="primary" onClick={handleBlock}>
          Block
        </Button>
      </div>
    </>
  )
}
