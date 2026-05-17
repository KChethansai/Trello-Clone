// MainPage component: renders a focused piece of the Trello clone UI.
import Sidebar from './Sidebar'
import Projects from './Projects'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function MainPage() {
  return (
    // relative so absolute/fixed child overlays (Settings, Notifications, Profile) position correctly
    <div className="relative flex flex-col h-screen bg-[#1d2125] overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Projects />
      </div>
      {/* nested overlays render above the dashboard */}
      <Outlet />
    </div>
  )
}

export default MainPage


