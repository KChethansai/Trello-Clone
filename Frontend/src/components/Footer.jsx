import { useNavigate } from 'react-router-dom'
import kanvoraLogo from '../assets/kanvora-logo.png'

const footerLinks = [
  { title: 'About Kanvora', text: "What's behind the board", path: '/about' },
  { title: 'Templates', text: 'Start faster with proven workflows', path: '/templates' },
  { title: 'Resources', text: 'Guides for better collaboration', path: '/resources' },
  { title: 'Contact', text: 'Get help planning your next project', path: '/guide' }
]

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-teal-100 bg-white text-teal-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
        {/* Brand */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left"
          >
            <img className="h-11 w-11 rounded-xl" src={kanvoraLogo} alt="Kanvora" />
            <span className="block text-xl font-bold text-teal-800">Kanvora</span>
          </button>
          <p className="mt-4 max-w-sm text-sm leading-6 text-teal-600">
            Modern boards, workspaces, templates, and collaboration flows for
            teams that need clarity without ceremony.
          </p>
        </div>

        {/* Links */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((link) => (
            <button
              key={link.title}
              type="button"
              onClick={() => navigate(link.path)}
              className="rounded-xl border border-transparent p-4 text-left transition-all hover:border-teal-200 hover:bg-teal-50 hover:shadow-sm"
            >
              <span className="block text-sm font-bold text-teal-800">{link.title}</span>
              <span className="mt-1 block text-xs leading-5 text-teal-600">{link.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-teal-100 px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-teal-500">
          © {new Date().getFullYear()} Kanvora. Built for teams who value clarity.
        </p>
      </div>
    </footer>
  )
}

export default Footer
