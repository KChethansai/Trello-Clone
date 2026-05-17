// Design component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'

const tools = [
  {
    name: 'Figma',
    desc: 'Connect Figma files directly to cards for seamless design handoff.',
    icon: 'ðŸŽ¨'
  },
  {
    name: 'InVision',
    desc: 'Link prototypes and gather feedback without leaving your board.',
    icon: 'ðŸ”-'
  },
  {
    name: 'Sketch',
    desc: 'Attach Sketch artboards and keep design files in context.',
    icon: 'Edit'
  },
  {
    name: 'Adobe CC',
    desc: 'Surface Creative Cloud assets directly on your Trello cards.',
    icon: 'Down'
  }
]

const workflowCards = [
  {
    title: 'Design Request Intake',
    desc: 'Capture every creative request, prioritize work, and keep stakeholders informed without the back-and-forth email chains.',
    color: 'from-pink-400 to-rose-500'
  },
  {
    title: 'Brand Asset Library',
    desc: 'Store logos, color palettes, and brand guidelines in one searchable board your whole team can access.',
    color: 'from-violet-400 to-purple-600'
  },
  {
    title: 'Launch Checklist',
    desc: 'Track every deliverable from concept to production with checklists, due dates, and owner assignments.',
    color: 'from-teal-400 to-cyan-500'
  }
]

function Design() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      {/* hero */}
      <div className="bg-linear-to-br from-pink-50 to-purple-50 py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <button
              onClick={() => navigate('/solutions')}
              className="text-blue-500 hover:underline text-sm mb-6 flex items-center gap-1"
            >
              Back to Solutions
            </button>
            <h1 className="text-5xl font-bold text-blue-950 mb-5 leading-tight">
              Trello for Design Teams
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From creative requests to cross-team collaboration, Trello helps
              design teams deliver beautiful work on time - every time.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
            >
              Start for free
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              className="w-full max-w-lg rounded-2xl shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              src="https://images.ctfassets.net/rz1oowkt5gyp/3ckrK4xwt7siEpoqbi2eSJ/5094464c2f3f376d9749c127de9cf03e/Engineering_Template_2x.png?w=740&fm=webp"
              alt="Design workflow in Trello"
            />
          </div>
        </div>
      </div>

      {/* logos */}
      <div className="bg-gray-50 py-12 px-6">
        <p className="text-center text-sm text-gray-500 mb-8 font-medium uppercase tracking-wide">
          Trusted by design teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto opacity-60">
          {['coinbase', 'johnDeere', 'Grand-Hyatt', 'Visa'].map((name) => (
            <img
              key={name}
              className="h-8 object-contain transition-all duration-300 hover:opacity-100 hover:-translate-y-1"
              src={`https://images.ctfassets.net/rz1oowkt5gyp/${
                name === 'coinbase'
                  ? '7nR3kQlx8IP5mfCCBTatsy/0b3952a6be3ebb10116d62aa93be7bbb/coinbase.svg'
                  : name === 'johnDeere'
                    ? '6VwRn7PI4zrZo84Uoa8rnt/b0ae3da34916a3ff02d26e2120efe9b8/johnDeere.svg'
                    : name === 'Grand-Hyatt'
                      ? '5KdQPApAFJpLMv9AntiNLk/530cef2a4b56ad758c1e91fad5c3e7ac/Grand-Hyatt.svg'
                      : '1zdBcYqeqkDsLUfggfKFRO/a732e0001ca5153ef7195eea63ff6a3b/Visa.svg'
              }`}
              alt={name}
            />
          ))}
        </div>
      </div>

      {/* workflow cards */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-950 text-center mb-4">
            Built for every stage of the creative process
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Whether you're running a solo studio or a 50-person design org,
            Trello adapts to the way your team works best.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflowCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className={`h-32 bg-linear-to-br ${card.color}`} />
                <div className="p-6 bg-white">
                  <h3 className="font-bold text-blue-950 text-lg mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* feature: visual workflows */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src="https://images.ctfassets.net/rz1oowkt5gyp/6zrD22xQAngEpRDcvQhRRS/268bec622423c5baa0ad4e1e5395f0ac/Timeline_View_Illo_4.png?w=1081&fm=webp"
              alt="Timeline view"
              className="rounded-2xl shadow-lg transition-all duration-500 hover:scale-105"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-blue-950 mb-4">
              See every project on a timeline
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Keep design sprints on track with Timeline View. Plan launches,
              align with engineering, and spot bottlenecks before they become
              blockers.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-500 font-semibold hover:underline flex items-center gap-1"
            >
              Learn more about Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* integrations */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-950 text-center mb-4">
            Connect your design stack
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Power-Ups bring your favourite design tools right inside Trello.
          </p>
        </div>
      </div>

      {/* cta */}
      <div className="bg-blue-600 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Great design starts with great organisation.
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of design teams using Trello to ship faster,
          collaborate better, and keep creativity flowing.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Get started - it's free
        </button>
      </div>
    </div>
  )
}

export default Design


