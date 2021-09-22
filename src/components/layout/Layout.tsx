import React, { FC } from 'react'
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'

export const Layout: FC<{className?: string}> = ({children, className}) => {
  return (
    <div className={`${className ?? ""} w-screen h-screen`}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
