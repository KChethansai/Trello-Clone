// CustomerStories component: renders a focused piece of the Trello clone UI.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsQuote } from 'react-icons/bs'

const industries = [
  'All',
  'Engineering',
  'Design',
  'Marketing',
  'Operations',
  'Education'
]

const stories = [
  {
    id: 1,
    company: 'SwagUp',
    industry: 'Operations',
    logo: 'https://images.ctfassets.net/rz1oowkt5gyp/5BRXfI8ghoEChfFcvYUOzT/4ae6c8c4dcaeb29a27a57a72fc67949f/magic-swagup.png?w=478&fm=webp',
    quote:
      'Not only did Trello unify our process and help everyone understand their role, but we were able to automate essential steps so we could move faster and grow to a multi-million dollar company with a team of ten.',
    author: 'Jeremy Trigg',
    role: 'Founder, SwagUp',
    color: 'from-blue-500 to-blue-700',
    stat: '10x',
    statLabel: 'faster onboarding'
  },
  {
    id: 2,
    company: 'Instinct Dog Training',
    industry: 'Operations',
    logo: 'https://images.ctfassets.net/rz1oowkt5gyp/22UrV2M73SFmMQNowgR4qw/6cb8439cf6343da98e0756f2990f9cc3/magic-instinct.png?w=397&fm=webp',
    quote:
      'As you scale, you need visibility, accountability, and organization. Trello has provided that for us.',
    author: 'Brian Burton',
    role: 'Founder, Instinct Dog Training',
    color: 'from-green-500 to-emerald-700',
    stat: '3x',
    statLabel: 'team growth'
  },
  {
    id: 3,
    company: 'Desk Plants',
    industry: 'Design',
    logo: 'https://images.ctfassets.net/rz1oowkt5gyp/7JCD51g6mwxcqLgAzfvSr/86da951ec89f4f0e401cc700436c0cac/business-class-desk-plants.png?w=488&fm=webp',
    quote:
      'We chose Trello because it is well-designed - beautifully designed - intuitive, and really hit the nail on the head with what we needed to solve.',
    author: 'Lawrence Hanley',
    role: 'Founder, Desk Plants',
    color: 'from-emerald-400 to-teal-600',
    stat: '40%',
    statLabel: 'less email'
  },
  {
    id: 4,
    company: 'Scan2CAD',
    industry: 'Engineering',
    logo: 'https://images.ctfassets.net/rz1oowkt5gyp/3EGeFh1CNlN0kED7PSN7D3/2524aca6067b5db8126bfc0564800e84/Scan2CAD_logo.png?w=460&fm=webp',
    quote:
      'We use Trello because our data becomes alive. A bullet point list turns into real tasks assigned to real people with due dates and connections to our other apps.',
    author: 'Luke Kennedy',
    role: 'CEO, Scan2CAD',
    color: 'from-violet-500 to-purple-700',
    stat: '5h',
    statLabel: 'saved per week'
  },
  {
    id: 5,
    company: 'Palace Law',
    industry: 'Operations',
    logo: 'https://images.ctfassets.net/rz1oowkt5gyp/6gqLvQanbBX5bevYnHBfIr/73fdb4b05d67c16792040e8973d3abc4/palace-law.png?w=405&fm=webp',
    quote:
      'People have generally been happier since we started using Trello. It has made our lives a lot easier. People are less stressed.',
    author: 'Jordan Couch',
    role: 'Attorney, Palace Law',
    color: 'from-emerald-500 to-green-700',
    stat: '100%',
    statLabel: 'team adoption'
  },
  {
    id: 6,
    company: 'Coinbase',
    industry: 'Engineering',
    logo: 'https://images.ctfassets.net/rz1oowkt5gyp/7nR3kQlx8IP5mfCCBTatsy/0b3952a6be3ebb10116d62aa93be7bbb/coinbase.svg',
    quote:
      "Trello gives our engineering teams the clarity they need to ship fast without losing sight of the big picture. It's become the connective tissue of how we work.",
    author: 'Engineering Lead',
    role: 'Coinbase',
    color: 'from-blue-400 to-indigo-600',
    stat: '2x',
    statLabel: 'sprint velocity'
  }
]

function CustomerStories() {
  const navigate = useNavigate()
  const [activeIndustry, setActiveIndustry] = useState('All')
  const [activeStory, setActiveStory] = useState(stories[0])

  const filtered =
    activeIndustry === 'All'
      ? stories
      : stories.filter((s) => s.industry === activeIndustry)

  return (
    <div className="bg-white">
      {/* hero */}
      <div className="bg-linear-to-br from-blue-950 to-blue-800 py-24 px-6 text-center">
        <h1 className="text-5xl font-bold text-white mb-5">Customer Stories</h1>
        <p className="text-blue-200 text-lg max-w-xl mx-auto">
          See how teams around the world use Trello to do their best work.
        </p>
      </div>

      {/* featured story */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div
          className={`rounded-3xl bg-linear-to-br ${activeStory.color} p-1 shadow-xl`}
        >
          <div className="bg-white rounded-[22px] p-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <img
                src={activeStory.logo}
                alt={activeStory.company}
                className="h-12 object-contain mb-6"
              />
              <BsQuote className="text-4xl text-blue-200 mb-3" />
              <p className="text-xl text-gray-700 leading-relaxed italic mb-6">
                "{activeStory.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-linear-to-br ${activeStory.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {activeStory.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {activeStory.author}
                  </p>
                  <p className="text-xs text-gray-500">{activeStory.role}</p>
                </div>
              </div>
            </div>
            <div className="text-center md:border-l md:border-gray-100 md:pl-10">
              <p
                className={`text-6xl font-bold bg-linear-to-br ${activeStory.color} bg-clip-text text-transparent`}
              >
                {activeStory.stat}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {activeStory.statLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* industry filter */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex gap-2 flex-wrap">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeIndustry === ind
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* story cards grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((story) => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 ${
                activeStory.id === story.id
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
            >
              <div className={`h-3 bg-linear-to-r ${story.color}`} />
              <div className="bg-white p-6">
                <img
                  src={story.logo}
                  alt={story.company}
                  className="h-8 object-contain mb-4"
                />
                <p className="text-gray-600 text-sm italic leading-relaxed mb-4 line-clamp-3">
                  "{story.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {story.author}
                    </p>
                    <p className="text-xs text-gray-400">{story.role}</p>
                  </div>
                  <span
                    className={`text-sm font-bold bg-linear-to-br ${story.color} bg-clip-text text-transparent`}
                  >
                    {story.stat} {story.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* cta */}
      <div className="bg-blue-600 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to write your own success story?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Join over 2 million teams already using Trello to do more, together.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Start for free
        </button>
      </div>
    </div>
  )
}

export default CustomerStories


