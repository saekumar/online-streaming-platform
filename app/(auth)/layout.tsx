import React, { Children } from 'react'
import { Logo } from './_components/logo'

type Props = {
  children: React.ReactNode
}

const AuthLayoutPage = ({ children }: Props) => {
  return (
    <div className=" h-full flex flex-col items-center justify-center space-y-6 ">
      <Logo />
      {children}
    </div>
  )
}

export default AuthLayoutPage
