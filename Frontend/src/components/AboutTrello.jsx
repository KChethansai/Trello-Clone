// AboutTrello component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'

const stats = [
  { value: '2M+', label: 'Teams worldwide' },
  { value: '50M+', label: 'Projects created' },
  { value: '200+', label: 'Power-Up integrations' },
  { value: '2011', label: 'Founded' }
]

const values = [
  {
    icon: 'ðŸ¤',
    title: 'Collaboration first',
    desc: 'We believe the best work happens together. Every feature we build makes it easier for teams to move as one.'
  },
  {
    icon: '*',
    title: 'Simplicity is power',
    desc: 'Complexity is the enemy of productivity. Trello stays simple so your team can focus on what matters.'
  },
  {
    icon: 'ðŸŒ',
    title: 'Built for everyone',
    desc: 'From solo freelancers to Fortune 500 teams, Trello scales to fit any workflow, any size.'
  },
  {
    icon: 'ðŸ”’',
    title: 'Trust & transparency',
    desc: 'Your data is yours. We handle it with care, respect your privacy, and are always honest about how we work.'
  }
]

const team = [
  {
    name: 'Joel Spolsky',
    role: 'Co-founder',
    avatar: 'JS',
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Michael Pryor',
    role: 'Co-founder',
    avatar: 'MP',
    color: 'from-teal-400 to-cyan-600'
  },
  {
    name: 'Bobby Grace',
    role: 'Head of Design',
    avatar: 'BG',
    color: 'from-violet-400 to-purple-600'
  },
  {
    name: 'Leah Rader',
    role: 'Head of Engineering',
    avatar: 'LR',
    color: 'from-pink-400 to-rose-500'
  }
]

function AboutTrello() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      {/* hero */}
      <div className="bg-linear-to-br from-blue-950 to-indigo-900 py-24 px-6 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          About Trello
        </h1>
        <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
          Trello is the visual work management tool that empowers your team to
          manage any type of project, workflow, or task tracking.
        </p>
      </div>

      {/* stats */}
      <div className="bg-blue-600 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-5xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-blue-100 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* story */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-950 mb-6">Our Story</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Trello was born in 2011 from a simple idea: what if you could see
            all your work, all your team's work, at a glance? Joel Spolsky and
            Michael Pryor built the first version in a weekend, and teams
            everywhere immediately fell in love with it.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            In 2017, Trello joined the Atlassian family - giving it the
            resources to scale globally while keeping the product simple and
            beloved. Today, over two million teams across every industry use
            Trello to organise work, communicate clearly, and ship great things.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We're proud of the community we've built, and we're just getting
            started.
          </p>
        </div>
      </div>

      {/* values */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-950 text-center mb-12">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="text-xl font-bold text-blue-950 mb-2">
                  {v.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* team */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-950 text-center mb-4">
            Meet the team
          </h2>
          <p className="text-center text-gray-500 mb-12">
            The people behind Trello's vision.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div
                  className={`w-20 h-20 rounded-full bg-linear-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}
                >
                  {member.avatar}
                </div>
                <p className="font-semibold text-blue-950">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* atlassian */}
      <div className="bg-blue-50 py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Part of the Atlassian family
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              As an Atlassian product, Trello connects seamlessly with Jira,
              Confluence, and the rest of the tools your team already loves -
              giving you a complete picture of how work gets done.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Trello free
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.ctfassets.net/rz1oowkt5gyp/5AE4nXLOennRxmmUMcgMLM/747e96bdd16cf4113e4ef867bd85fd29/solutions.svg"
              alt="Atlassian"
              className="w-48 opacity-80"
            />
          </div>
        </div>
      </div>

      {/* jobs cta */}
      <div className="py-16 px-6 text-center border-t border-gray-100">
        <h2 className="text-3xl font-bold text-blue-950 mb-3">
          Want to join us?
        </h2>
        <p className="text-gray-500 mb-6">
          We're always looking for passionate people to help shape the future of
          work.
        </p>
        <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
          View open roles
        </button>
      </div>
    </div>
  )
}

export default AboutTrello


