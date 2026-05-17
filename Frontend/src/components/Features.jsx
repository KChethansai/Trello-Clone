// Features component: renders a focused piece of the Trello clone UI.
import {
  BsInbox,
  BsCalendar,
  BsLayoutWtf
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import {
  featuresGrid,
  featureItemCard,
  featureItemIcon,
  featureItemTitle,
  featureItemDesc
} from '../Styles/common'
function Features() {
  const navigate = useNavigate()
  const featuresData = [
    {
      icon: <BsInbox />,
      title: 'Inbox',
      desc: 'Capture every vital detail from emails, Slack, and more directly into your Trello Inbox.',
      onClick: () => navigate('/inbox')
    },
    {
      icon: <BsCalendar />,
      title: 'Planner',
      desc: 'Sync your calendar and allocate focused time slots to boost productivity.',
      onClick: () => {
        navigate('/planner')
      }
    },
    {
      icon: <BsLayoutWtf />,
      title: 'Templates',
      desc: 'Give your team a blueprint for success with easy-to-use templates.',
      onClick: () => {
        navigate('/templates')
      }
    }
  ]
  return (
    <div>
      <div className="">
        <h1
          className="text-6xl text-center bg-[#1193a1] p-20 text-white font-semibold"
          style={{
            backgroundImage:
              'url(data:image/jpeg;base64,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)',
            backgroundSize: '100%'
          }}
        >
          Trello Features
        </h1>
        <p className="text-center text-lg font-semibold p-5 bg-linear-to-r from-teal-100 via-cyan-50 to-blue-100 text-slate-800">
          Capture every idea, organize every task, and keep your entire team
          moving forward - all from one powerful workspace.
        </p>
      </div>
      <div className={`${featuresGrid} mt-30 mr-7 ml-7`}>
        {featuresData.map((f) => (
          <div key={f.title} className={featureItemCard} onClick={f.onClick}>
            <span className={featureItemIcon}>{f.icon}</span>
            <p className={featureItemTitle}>{f.title}</p>
            <p className={featureItemDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features


