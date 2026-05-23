// Features component: pre-login marketing page.
import { useNavigate } from 'react-router-dom'

const featuresData = [
  {
    title: 'Inbox',
    desc: 'Capture every vital detail from emails, Slack, and more directly into your Kanvora Inbox.',
    img: 'https://images.ctfassets.net/rz1oowkt5gyp/15yelj0vFDnyOgwyWAZSup/bbdc0dfa821ff9056b2eae8a782c14bf/inbox-hero-updated.png?w=1440&fm=webp',
    path: '/inbox'
  },
  {
    title: 'Planner',
    desc: 'Sync your calendar and allocate focused time slots to boost productivity.',
    img: 'https://images.ctfassets.net/rz1oowkt5gyp/6zrD22xQAngEpRDcvQhRRS/268bec622423c5baa0ad4e1e5395f0ac/Timeline_View_Illo_4.png?w=1081&fm=webp',
    path: '/planner'
  },
  {
    title: 'Templates',
    desc: 'Give your team a blueprint for success with easy-to-use templates.',
    img: 'https://images.ctfassets.net/rz1oowkt5gyp/3ckrK4xwt7siEpoqbi2eSJ/5094464c2f3f376d9749c127de9cf03e/Engineering_Template_2x.png?w=740&fm=webp',
    path: '/templates'
  }
]

function Features() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f0fdfa]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50/50 py-20 px-6 border-b border-teal-100">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-teal-900 mb-5 leading-tight tracking-tight">
            Kanvora Features For High-Performing Teams
          </h1>
          <p className="text-lg text-teal-700 max-w-2xl leading-relaxed">
            Capture every idea, organize every task, and keep your entire team
            moving forward — all from one powerful, beautifully crafted workspace.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((f) => (
            <div
              key={f.title}
              onClick={() => navigate(f.path)}
              className="rounded-2xl overflow-hidden border border-teal-100 bg-white hover:border-teal-300 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-sm hover:shadow-lg flex flex-col"
            >
              <div className="h-44 overflow-hidden bg-teal-50">
                <img
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  src={f.img}
                  alt={f.title}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="font-bold text-xl mb-3 tracking-tight text-teal-800 group-hover:text-teal-600 transition-colors underline">
                  {f.title}
                </h2>
                <p className="text-teal-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
