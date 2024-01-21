'use client'

import { Button } from '@/components/ui/button'
import { CheckCheck, Copy } from 'lucide-react'
import { useState } from 'react'

interface copyButtonProps {
  value?: string
}

export const CopyButton = ({ value }: copyButtonProps) => {
  const [isCopied, setISCopied] = useState(false)

  const onCopy = () => {
    if (!value) return

    setISCopied(true)
    navigator.clipboard.writeText(value)
    setTimeout(() => {
      setISCopied(false)
    }, 10000)
  }

  const Icon = isCopied ? CheckCheck : Copy
  return (
    <Button
      className=""
      variant="primary"
      onClick={onCopy}
      disabled={!value || isCopied}
      size="sm"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
