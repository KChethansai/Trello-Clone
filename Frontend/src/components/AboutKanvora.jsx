// AboutKanvora component: renders a focused piece of the Kanvora UI.
import { useNavigate } from 'react-router-dom'
import {
  surfaceBg,
  accentBg,
  primaryText,
  mutedText,
  pageBg,
  accentBgHover,
  defaultBorderColor,
  accentText
} from '../Styles/common'

const stats = [
  { value: '2M+', label: 'Teams worldwide' },
  { value: '50M+', label: 'Projects created' },
  { value: '200+', label: 'Integrations' },
  { value: '2011', label: 'Founded' }
]

const values = [
  {
    icon: '01',
    title: 'Collaboration first',
    desc: 'We believe the best work happens together. Every feature we build makes it easier for teams to move as one.'
  },
  {
    icon: '*',
    title: 'Simplicity is power',
    desc: 'Complexity is the enemy of productivity. Kanvora stays simple so your team can focus on what matters.'
  },
  {
    icon: '03',
    title: 'Built for everyone',
    desc: 'From solo freelancers to Fortune 500 teams, Kanvora scales to fit any workflow, any size.'
  },
  {
    icon: '04',
    title: 'Trust & transparency',
    desc: 'Your data is yours. We handle it with care, respect your privacy, and are always honest about how we work.'
  }
]

const team = [
  {
    name: 'K.ChethanSai',
    role: 'Front-End',
    avatar: 'C',
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'AdityaMurthi',
    role: 'Front-End',
    avatar: 'AM',
    color: 'from-teal-400 to-cyan-600'
  },
  {
    name: 'Nithish',
    role: 'Back-End',
    avatar: 'N',
    color: 'from-violet-400 to-purple-600'
  },
  {
    name: 'Sreeman',
    role: 'Back-End',
    avatar: 'S',
    color: 'from-pink-400 to-rose-500'
  },
  {
    name: 'Samanvi',
    role: 'Back-End',
    avatar: 'S',
    color: 'from-pink-400 to-rose-500'
  }
]

function AboutKanvora() {
  const navigate = useNavigate()

  return (
    <div className={`${surfaceBg}`}>
      {/* hero */}
      <div className="bg-linear-to-br from-[#050505] via-[#111111] to-[#3b0a14] py-24 px-6 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          About Kanvora
        </h1>
        <p className={`${surfaceBg} text-xl max-w-2xl mx-auto leading-relaxed`}>
          Kanvora is the visual work management tool that empowers your team to
          manage any type of project, workflow, or task tracking.
        </p>
      </div>

      {/* stats */}
      <div className={`${accentBg} py-14 px-6`}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-5xl font-bold text-white mb-1">{s.value}</p>
              <p className={`${surfaceBg} text-sm font-medium`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* story */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl font-bold ${primaryText} mb-6`}>
            Our Story
          </h2>
          <p className={`${mutedText} text-lg leading-relaxed mb-6`}>
            Kanvora was born from a simple idea: what if you could see all your
            work, all your team's work, at a glance? Joel Spolsky and Michael
            Pryor built the first version in a weekend, and teams everywhere
            immediately fell in love with it.
          </p>
          <p className={`${mutedText} text-lg leading-relaxed mb-6`}>
            Since then, Kanvora has continued to scale globally while keeping
            the product simple and beloved. Today, over two million teams across
            every industry use Kanvora to organise work, communicate clearly,
            and ship great things.
          </p>
          <p className={`${mutedText} text-lg leading-relaxed`}>
            We're proud of the community we've built, and we're just getting
            started.
          </p>
        </div>
      </div>

      {/* values */}
      <div className={`${pageBg} py-20 px-6`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold ${primaryText} text-center mb-12`}>
            What we stand for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="premium-card premium-card-hover rounded-2xl p-8"
              >
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className={`text-xl font-bold ${primaryText} mb-2`}>
                  {v.title}
                </h3>
                <p className={`${mutedText} leading-relaxed`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* team */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold ${primaryText} text-center mb-4`}>
            Meet the team
          </h2>
          <p className={`text-center ${mutedText} mb-12`}>
            The people behind Kanvora's vision.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center w-40">
                <div
                  className={`w-20 h-20 rounded-full bg-linear-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg`}
                >
                  {member.avatar}
                </div>
                <p className={`font-semibold ${primaryText}`}>{member.name}</p>
                <p className={`text-sm ${mutedText}`}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* integrations */}
      <div className={`${pageBg} py-16 px-6`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className={`text-3xl font-bold ${primaryText} mb-4`}>
              Connect your favorite tools
            </h2>
            <p className={`${mutedText} leading-relaxed mb-4`}>
              Kanvora connects seamlessly with the rest of the tools your team
              already loves - giving you a complete picture of how work gets
              done.
            </p>
            <button
              onClick={() => navigate('/register')}
              className={`${accentBg} text-white px-6 py-3 rounded-xl font-semibold ${accentBgHover} transition-colors`}
            >
              Try Kanvora free
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.ctfassets.net/rz1oowkt5gyp/5AE4nXLOennRxmmUMcgMLM/747e96bdd16cf4113e4ef867bd85fd29/solutions.svg"
              alt="Integrations"
              className="w-48 opacity-80"
            />
          </div>
        </div>
      </div>

      {/* jobs cta */}
      <div className={`py-16 px-6 text-center border-t ${defaultBorderColor}`}>
        <h2 className={`text-3xl font-bold ${primaryText} mb-3`}>
          Want to join us?
        </h2>
        <p className={`${mutedText} mb-6`}>
          We're always looking for passionate people to help shape the future of
          work.
        </p>
        <button
          className={`border ${defaultBorderColor} ${accentText} px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors`}
        >
          View open roles
        </button>
      </div>
    </div>
  )
}

export default AboutKanvora
