import React from 'react'
import { Navbar } from './_components/navbar'
import { Container } from './_components/container'
import { Sidebar, SidebarSkeleton } from './_components/sidebar'
import { Suspense } from 'react'
type Props = {
  children: React.ReactNode
}

const BrowseLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <div className="flex h-full pt-20">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Sidebar />
        <Container>{children}</Container>
      </div>
    </>
  )
}

export default BrowseLayout
