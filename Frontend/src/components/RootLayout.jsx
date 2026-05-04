import Header from './Header'
import Footer from './Footer'
import { useEffect } from 'react'
import { Outlet } from 'react-router'

function RootLayout() {
  return (
    <div>
      <Header />
      <div className="">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout
