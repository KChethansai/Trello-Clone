import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsArrowRight,
  BsBarChart,
  BsCheck2Circle,
  BsKanban,
  BsLightning,
  BsPeopleFill,
  BsStars
} from 'react-icons/bs'
import { useAuth } from '../store/authStore'
import { pubBtnPrimary, pubBtnSecondary, pubEyebrow } from '../Styles/common'

const highlights = [
  {
    icon: <BsKanban />,
    title: 'Visual workspaces',
    desc: 'Plan projects with boards, lists, cards, labels, and drag-and-drop workflows.'
  },
  {
    icon: <BsPeopleFill />,
    title: 'Collaboration built in',
    desc: 'Invite teams, manage workspace members, and keep every update visible.'
  },
  {
    icon: <BsLightning />,
    title: 'Fast execution',
    desc: 'Create work quickly with templates, quick actions, and focused board views.'
  },
  {
    icon: <BsBarChart />,
    title: 'Operational clarity',
    desc: 'Track progress with status lanes, recent projects, and lightweight activity cues.'
  }
]

const stats = [
  ['40+', 'frontend surfaces'],
  ['Realtime', 'socket-ready boards'],
  ['MERN', 'production stack']
]

function Home() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main-page', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/register', { state: { email } })
  }

  return (
    <main className="overflow-hidden bg-[#f0fdfa]">
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 -z-0 bg-gradient-to-br from-teal-100/60 via-white to-cyan-50/40" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div className="animate-slide-up">
            <p className={pubEyebrow}>Modern collaboration platform</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-teal-900 sm:text-5xl lg:text-6xl leading-tight">
              Turn scattered tasks into calm, visible team momentum.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-teal-700">
              A polished Kanvora-style workspace for planning, assigning,
              discussing, and shipping work without losing context between
              boards, teams, and updates.
            </p>

            {isAuthenticated ? (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/main-page')}
                  className={pubBtnPrimary}
                >
                  Go to your workspace <BsArrowRight />
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 flex-1 rounded-lg border border-teal-200 bg-white px-4 text-sm text-teal-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-teal-400"
                />
                <button type="submit" className={pubBtnPrimary}>
                  Start free <BsArrowRight />
                </button>
              </form>
            )}

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-white border border-teal-100 rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-lg font-bold text-teal-800">{value}</p>
                  <p className="text-xs text-teal-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-enter">
            <div className="absolute -inset-4 rounded-[2rem] bg-teal-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl bg-white border border-teal-100 shadow-xl">
              <video
                className="aspect-[16/11] w-full object-cover"
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
              <div className="grid gap-3 border-t border-teal-100 bg-teal-50 p-4 sm:grid-cols-3">
                {['Plan', 'Collaborate', 'Ship'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-white border border-teal-100 px-3 py-2 text-sm font-semibold text-teal-700"
                  >
                    <BsCheck2Circle className="text-teal-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className={pubEyebrow}>Designed for daily work</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-teal-900">
              Everything your team expects, nothing in the way.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className={`${pubBtnSecondary} hidden sm:inline-flex`}
          >
            <BsStars /> Browse templates
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-xl text-teal-600">
                {item.icon}
              </span>
              <h3 className="text-base font-bold text-teal-800">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-teal-600">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
