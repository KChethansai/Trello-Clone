// Design component: pre-login marketing page for design teams.
import { useNavigate } from 'react-router-dom'
import { pubBtnPrimary } from '../Styles/common'

const workflowCards = [
  {
    title: 'Design Request Intake',
    desc: 'Capture every creative request, prioritize work, and keep stakeholders informed without the back-and-forth email chains.',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    title: 'Brand Asset Library',
    desc: 'Store logos, color palettes, and brand guidelines in one searchable board your whole team can access.',
    color: 'from-cyan-400 to-teal-600'
  },
  {
    title: 'Launch Checklist',
    desc: 'Track every deliverable from concept to production with checklists, due dates, and owner assignments.',
    color: 'from-teal-300 to-emerald-500'
  }
]

function Design() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#f0fdfa]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50/50 py-20 px-6 border-b border-teal-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <button
              onClick={() => navigate('/solutions')}
              className="text-teal-600 hover:underline text-sm mb-6 flex items-center gap-1 font-semibold"
            >
              ← Back to Solutions
            </button>
            <h1 className="text-5xl font-bold text-teal-900 mb-5 leading-tight tracking-tight">
              Kanvora for Design Teams
            </h1>
            <p className="text-lg text-teal-700 mb-8 leading-relaxed">
              From creative requests to cross-team collaboration, Kanvora helps
              design teams deliver beautiful work on time — every time.
            </p>
            <button
              onClick={() => navigate('/register')}
              className={`${pubBtnPrimary} px-8 py-3.5 text-base rounded-xl`}
            >
              Start for free
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              className="w-full max-w-lg rounded-2xl shadow-lg border border-teal-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              src="https://images.ctfassets.net/rz1oowkt5gyp/3ckrK4xwt7siEpoqbi2eSJ/5094464c2f3f376d9749c127de9cf03e/Engineering_Template_2x.png?w=740&fm=webp"
              alt="Design workflow in Kanvora"
            />
          </div>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-teal-900 text-center mb-4 tracking-tight">
            Built for every stage of the creative process
          </h2>
          <p className="text-center text-teal-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're running a solo studio or a 50-person design org,
            Kanvora adapts to the way your team works best.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflowCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl overflow-hidden border border-teal-100 bg-white hover:border-teal-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm hover:shadow-lg"
              >
                <div className={`h-32 bg-gradient-to-br ${card.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="p-6">
                  <h3 className="font-bold text-teal-800 text-lg mb-2 group-hover:text-teal-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-teal-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature: visual workflows */}
      <div className="bg-teal-50 py-20 px-6 border-y border-teal-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src="https://images.ctfassets.net/rz1oowkt5gyp/6zrD22xQAngEpRDcvQhRRS/268bec622423c5baa0ad4e1e5395f0ac/Timeline_View_Illo_4.png?w=1081&fm=webp"
              alt="Timeline view"
              className="rounded-2xl shadow-lg border border-teal-100 transition-all duration-500 hover:scale-105"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-teal-900 mb-4 tracking-tight">
              See every project on a timeline
            </h2>
            <p className="text-teal-700 text-lg mb-6 leading-relaxed">
              Keep design sprints on track with Timeline View. Plan launches,
              align with engineering, and spot bottlenecks before they become
              blockers.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-teal-600 font-semibold hover:underline flex items-center gap-1"
            >
              Learn more about Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Great design starts with great organization.
        </h2>
        <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Join thousands of design teams using Kanvora to ship faster,
          collaborate better, and keep creativity flowing.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
        >
          Get started — it's free
        </button>
      </div>
    </div>
  )
}

export default Design
