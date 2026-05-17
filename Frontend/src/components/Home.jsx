// Home component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  homeWrapper,
  heroSection,
  heroHeading,
  heroSubheading,
  heroEmailRow,
  heroEmailInput,
  heroSignupBtn,
  heroVideo,
  featureHighlights,
  featureCard,
  featureCardIcon,
  featureCardTitle,
  featureCardDesc
} from '../Styles/common'
import { BsKanban, BsLightning, BsPeopleFill, BsPlugin } from 'react-icons/bs'

const highlights = [
  {
    icon: <BsKanban />,
    title: 'Projects & Cards',
    desc: 'Organize your work into visual projects with draggable cards and lists.'
  },
  {
    icon: <BsPeopleFill />,
    title: 'Team Collaboration',
    desc: 'Invite teammates, assign tasks, and track progress together in real time.'
  },
  {
    icon: <BsLightning />,
    title: 'Automation',
    desc: 'Automate repetitive tasks with Butler-your built-in no-code assistant.'
  },
  {
    icon: <BsPlugin />,
    title: 'Power-Ups',
    desc: 'Extend projects with integrations for Slack, Google Drive, and 200+ apps.'
  }
]

function Home() {
  const navigate = useNavigate()
  const [email, Setemail] = useState('')
  const handelsubmit = () => {
    navigate('/register', {
      state: {
        email
      }
    })
  }
  return (
    <div className={homeWrapper}>
      <div className={heroSection}>
        <div className="flex-1 max-w-xl">
          <h1 className={heroHeading}>
            Capture, organize, and tackle your to-dos from anywhere.
          </h1>
          <p className={heroSubheading}>
            Escape the clutter and chaos-unleash your productivity with Trello.
          </p>

          <div className={heroEmailRow}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => Setemail(e.target.value)}
              className={heroEmailInput}
            />
            <button
              onClick={handelsubmit}
              type="submit"
              className={heroSignupBtn}
            >
              Sign up
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center ml-40 w-200">
          <video
            className={`${heroVideo} transition-all duration-300 hover:-translate-y-3  hover:scale-125 cursor-pointer`}
            loop
            autoPlay
            muted
            playsInline
          >
            <source
              src="https://videos.ctfassets.net/rz1oowkt5gyp/4AJBdHGUKUIDo7Po3f2kWJ/3923727607407f50f70ccf34ab3e9d90/updatedhero-mobile-final.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      <div className={`${featureHighlights}`}>
        {highlights.map((f) => (
          <div
            key={f.title}
            className={`${featureCard} transition-all  hover:-translate-y-3  hover:scale-106 cursor-pointer `}
          >
            <span className={featureCardIcon}>{f.icon}</span>
            <p className={featureCardTitle}>{f.title}</p>
            <p className={featureCardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home


