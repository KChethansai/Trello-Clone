// RootLayout component: renders a focused piece of the Trello clone UI.
import Header from './Header'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
//routes where only the dark dashboard Navbar is shown (not the public Header)
const navbarOnlyRoutes = ['/workspaces']

//routes where NO header and NO footer are shown (full-screen app pages)
const noHeaderRoutes = ['/main-page', '/templates', '/workspaces', '/projects']

//routes where the Footer should be hidden
const noFooterRoutes = [
  '/login',
  '/register',
  '/main-page',
  '/templates',
  '/workspaces',
  '/projects'
]

function RootLayout() {
  const { pathname } = useLocation()
  const path = pathname.toLowerCase()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  const showNavbar = navbarOnlyRoutes.some((r) => path.startsWith(r))
  const hideHeader = noHeaderRoutes.some((r) => path.startsWith(r))
  const hideFooter = noFooterRoutes.some((r) => path.startsWith(r))

  return (
    <div>
      {/* dashboard Navbar for workspace pages only */}
      {showNavbar && <Navbar />}

      {/* marketing Header for public pages */}
      {!hideHeader && !showNavbar && <Header />}

      <div className={hideHeader ? 'h-screen overflow-hidden' : 'min-h-screen'}>
        <Outlet />
      </div>

      {!hideFooter && <Footer />}
    </div>
  )
}

export default RootLayout


