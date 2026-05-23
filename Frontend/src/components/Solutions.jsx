// Solutions component: pre-login marketing page.
import { useNavigate } from 'react-router-dom'

const solutionsCards = [
  {
    title: 'Engineering',
    desc: 'Ship more code and enable your team to be more agile with Kanvora for developers.',
    img: 'https://images.ctfassets.net/rz1oowkt5gyp/43aZ773YpXmOpe2397gKqI/7650df47790b9fbc743e49e3fa6cf27b/Trello_Kanban_Board.png?w=740&fm=webp',
    path: '/engineering'
  },
  {
    title: 'Design',
    desc: 'From creative requests to cross-team collaboration, learn how Kanvora helps design teams deliver with style.',
    img: 'https://images.squarespace-cdn.com/content/v1/5fc6dab681da8a590dace76d/57a685be-3a73-4423-b237-f61e03ca0eb5/Hero+Background+Populus.png',
    path: '/design'
  },
  {
    title: 'Personal Productivity',
    desc: 'Discover how to use Kanvora to take your personal productivity to the next level.',
    img: 'https://framerusercontent.com/images/8YUni5hIXQdBq5IrkNfzONHyI4.png?width=2150&height=1187',
    path: '/'
  },
  {
    title: 'Team Management',
    desc: 'From project coordination to your next virtual party, level up team productivity and management practices with Kanvora.',
    img: 'https://images.ctfassets.net/rz1oowkt5gyp/4vK9L1yVpe00r940X3a31c/64deca2bbaeb9d4de1e3a6efdf19db0b/Collaboration.png?w=740&fm=webp',
    path: '/team-management'
  }
]

function Solutions() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#f0fdfa]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50/50 py-20 px-6 border-b border-teal-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-teal-900 mb-5 leading-tight tracking-tight">
              Kanvora Solutions For All Teams
            </h1>
            <p className="text-lg text-teal-700 mb-8 leading-relaxed">
              It's easy to get your entire team up and running with Kanvora. Click
              on a team type below to uncover all of the projects, techniques, and
              integrations you need to succeed.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              className="w-full max-w-lg rounded-2xl shadow-lg border border-teal-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              src="https://images.ctfassets.net/rz1oowkt5gyp/5AE4nXLOennRxmmUMcgMLM/747e96bdd16cf4113e4ef867bd85fd29/solutions.svg"
              alt="Solutions overview"
            />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutionsCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="rounded-2xl overflow-hidden border border-teal-100 bg-white hover:border-teal-300 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-sm hover:shadow-lg flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-teal-50">
                <img
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  src={card.img}
                  alt={card.title}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="font-bold text-xl mb-3 tracking-tight text-teal-800 group-hover:text-teal-600 transition-colors underline">
                  {card.title}
                </h2>
                <p className="text-teal-600 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Solutions
