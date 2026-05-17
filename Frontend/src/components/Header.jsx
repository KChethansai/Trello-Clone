// Header component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'
import { primaryBtn } from '../Styles/common'

function Header() {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e5e5ea] hover:shadow">
      <div className="flex items-center justify-between px-8 py-3">
        {/* Left Side */}
        <div className="flex items-center gap-14">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              className="w-13 h-13 rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-200"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAXVBMVEUygs3///8Wecrk7PefvuMkfcve6PUee8vB1u7F2e/O4PLK3PAsgMxgmtb6/P4pfsypx+jr8/qPteCWuuM8iNCwy+l4qNsQd8pTldXY5fSJst9GjtJuo9nm7/mnxOazNwU+AAAB1ElEQVR4nO3d3VLiMBiA4VItoVIsPyrgut7/Za7uerAn0GQMnc+Z57mAb/JOA2dJmgYAAAAAAAAAAAAAAOD2hpTaDKkbcoZ1ecNSzrA6hrTZnpcZ1oenNDktPR3WOcPO281cjcPQL3I97tuJae3hMXtan7UnKgTuspf0YXv9K3bPJcN2wxyJaV2ypsXiZbwybHwpG9ZPbYkKxk3Zmha745Vpx6L98GFz+4+YirbVp9PlRQ2n0mHP039d39WeSxe1v7xNu33psPPtt2l7V7qo++5y4X3psDuFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFChUqVKhQoUKFP7pwfC0d9tPOzAy/SodNHPYLV9gcl4XDZji7Vrew9KzfHOcP6xY2XdEvcTnHMdnKhU16+509adXMcUi2dmEzDm/vq//1/6y/PHxZv5/mOctdvbAZxpRnprPq9QujUagwPoUK41OoMD6FCuNTqDA+hQrjU6gwPoUK41OoMD6FCuNTqDC+qvcIh1T1LuiQ6t7nHVLKv1X/r6t3sodU9179mLpVdt/02wghfb5v8ZDzJEWf875FTFXfKAEAAAAAAAAAAAAAAAjlD7dCOFY7T154AAAAAElFTkSuQmCC"
              alt="Trello"
            />

            <div className="leading-5">
              <h1 className="text-[#0066cc] font-bold text-xl tracking-tight">
                Atlassian
              </h1>

              <h1 className="text-[#1d1d1f] font-bold text-xl tracking-tight">
                Trello
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center gap-8">
              <li>
                <button
                  onClick={() => navigate('/features')}
                  className="text-lg font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate('/solutions')}
                  className="text-lg font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors cursor-pointer"
                >
                  Solutions
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate('/resources')}
                  className="text-lg font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors cursor-pointer"
                >
                  Resources
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={primaryBtn}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className={primaryBtn}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header


