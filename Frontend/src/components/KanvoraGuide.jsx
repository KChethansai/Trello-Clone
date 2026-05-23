import {
  defaultBorderColor,
  pageBg,
  mutedText,
  primaryText,
  successText,
  surfaceBg,
  accentText,
  accentBg
} from '../Styles/common'
// KanvoraGuide component: renders a focused piece of the Kanvora UI.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsGrid3X3Gap,
  BsListUl,
  BsCreditCard,
  BsPeopleFill,
  BsLightning,
  BsPlugin,
  BsChevronDown,
  BsChevronRight,
  BsCheckCircleFill
} from 'react-icons/bs'

const steps = [
  {
    id: 1,
    icon: <BsGrid3X3Gap />,
    title: 'Create a Project',
    color: 'from-blue-400 to-blue-600',
    desc: 'A Kanvora project represents a project or workflow. Think of it as a whiteboard filled with lists of cards.',
    details: [
      'Click "Create new project" from the dashboard',
      'Give your project a clear name (e.g. "Q3 Marketing Campaign")',
      'Choose a background colour or image',
      'Set visibility: Private, Workspace, or Public'
    ]
  },
  {
    id: 2,
    icon: <BsListUl />,
    title: 'Add Lists',
    color: 'from-violet-400 to-purple-600',
    desc: 'Lists represent stages in your workflow. The classic setup is To Do -> In Progress -> Done.',
    details: [
      'Click "Add another list" on the project',
      'Common lists: Backlog, To Do, In Progress, Review, Done',
      'Drag lists to reorder them at any time',
      'Add as many lists as your workflow needs'
    ]
  },
  {
    id: 3,
    icon: <BsCreditCard />,
    title: 'Create Cards',
    color: 'from-teal-400 to-cyan-600',
    desc: 'Cards are your tasks or ideas. Click into a card to add descriptions, attachments, due dates, and more.',
    details: [
      'Click "Add a card" at the bottom of any list',
      'Open a card to add description, labels, due dates',
      'Attach files, links, or images',
      'Add checklists to break work into sub-tasks'
    ]
  },
  {
    id: 4,
    icon: <BsPeopleFill />,
    title: 'Invite your Team',
    color: 'from-pink-400 to-rose-500',
    desc: 'Collaboration is where Kanvora shines. Invite teammates, assign cards, and track progress together.',
    details: [
      'Click "Share" on any project to invite members',
      'Assign cards to specific team members',
      'Comment on cards for contextual communication',
      'Get notified when things change'
    ]
  },
  {
    id: 5,
    icon: <BsLightning />,
    title: 'Automate with Kanvora Flow',
    color: 'from-amber-400 to-orange-500',
    desc: 'Kanvora Flow is our built-in automation engine. No code required - just tell it what to do.',
    details: [
      'Create rules: "When a card is moved to Done, mark all checklist items complete"',
      'Schedule commands: "Every Monday, move overdue cards to the top"',
      'Add buttons to cards for one-click automation',
      'Set due-date triggers and email alerts'
    ]
  },
  {
    id: 6,
    icon: <BsPlugin />,
    title: 'Add Integrations',
    color: 'from-emerald-400 to-green-600',
    desc: 'Integrations connect Kanvora to your favourite apps - Slack, Google Drive, GitHub, Figma, and 200+ more.',
    details: [
      'Open project menu -> Integrations',
      'Popular: Slack, Google Drive, GitHub, Figma, Jira',
      'Integrations to see due dates in a calendar view',
      'Custom Fields to add metadata to any card'
    ]
  }
]

const faqs = [
  {
    q: 'Is Kanvora free?',
    a: 'Yes! Kanvora has a generous free tier with unlimited cards, up to 10 projects per workspace, and access to iOS and Android apps. Paid plans unlock unlimited projects, advanced automations, and more integrations.'
  },
  {
    q: 'Can I use Kanvora for personal projects?',
    a: 'Absolutely. Kanvora works great as a personal task manager, reading list, travel planner, or habit tracker. Many of our users start with personal projects before bringing their teams onboard.'
  },
  {
    q: 'How is Kanvora different from Jira?',
    a: 'Kanvora is visual, flexible, and easy to set up in minutes - ideal for any team or workflow. Jira is built specifically for software development with advanced issue tracking and reporting. They work great together via the Jira integration.'
  },
  {
    q: 'Can I import data from other tools?',
    a: 'Yes. You can import projects from Asana, CSV files, and other tools via the project settings. Kanvora also supports a full REST API for custom migrations.'
  },
  {
    q: 'Is my data secure?',
    a: 'Kanvora uses industry-standard TLS encryption in transit and AES-256 at rest, meeting SOC 2 Type II and ISO 27001 standards.'
  }
]

function Step({ step, index, isOpen, onToggle }) {
  return (
    <div className={`rounded-2xl border ${defaultBorderColor} overflow-hidden`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 p-5 text-left ${pageBg} transition-colors`}
      >
        <div
          className={`w-10 h-10 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center text-white text-lg shrink-0`}
        >
          {step.icon}
        </div>
        <div className="flex-1">
          <p
            className={`text-xs font-semibold ${mutedText} uppercase tracking-wide`}
          >
            Step {index + 1}
          </p>
          <h3 className={`font-bold ${primaryText}`}>{step.title}</h3>
        </div>
        {isOpen ? (
          <BsChevronDown className={`${mutedText} shrink-0`} />
        ) : (
          <BsChevronRight className={`${mutedText} shrink-0`} />
        )}
      </button>

      {isOpen && (
        <div className={`px-5 pb-5 border-t ${defaultBorderColor}`}>
          <p className={`${mutedText} text-sm mt-4 mb-4 leading-relaxed`}>
            {step.desc}
          </p>
          <ul className="space-y-2">
            {step.details.map((detail, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-sm ${mutedText}`}
              >
                <BsCheckCircleFill
                  className={`${successText} mt-0.5 shrink-0 text-xs`}
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function KanvoraGuide() {
  const navigate = useNavigate()
  const [openStep, setOpenStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className={`${surfaceBg}`}>
      {/* hero */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 py-24 px-6 text-center">
        <h1 className="text-5xl font-bold text-white mb-5">
          Getting Started with Kanvora
        </h1>
        <p className={`${surfaceBg} text-lg max-w-xl mx-auto mb-8`}>
          Everything you need to go from zero to productive in under 10 minutes.
        </p>
        <button
          onClick={() => navigate('/register')}
          className={`${surfaceBg} ${accentText} font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors`}
        >
          Create your free account
        </button>
      </div>

      {/* overview cards */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className={`text-3xl font-bold ${primaryText} text-center mb-3`}>
          How Kanvora works
        </h2>
        <p className={`text-center ${mutedText} mb-12 max-w-2xl mx-auto`}>
          Kanvora uses three core building blocks - projects, lists, and cards -
          to to help you visualise and manage any workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <BsGrid3X3Gap className="text-3xl" />,
              title: 'Projects',
              color: 'from-blue-400 to-blue-600',
              desc: 'A project represents a project. It holds all your lists and cards in one visual space.'
            },
            {
              icon: <BsListUl className="text-3xl" />,
              title: 'Lists',
              color: 'from-violet-400 to-purple-600',
              desc: 'Lists are columns on your project. They represent stages in your workflow like To Do or Done.'
            },
            {
              icon: <BsCreditCard className="text-3xl" />,
              title: 'Cards',
              color: 'from-teal-400 to-cyan-600',
              desc: 'Cards are your individual tasks. Drag them between lists as work progresses.'
            }
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-8 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-linear-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-4`}
              >
                {item.icon}
              </div>
              <h3 className={`text-xl font-bold ${primaryText} mb-2`}>
                {item.title}
              </h3>
              <p className={`${mutedText} text-sm leading-relaxed`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* step-by-step accordion */}
        <h2 className={`text-3xl font-bold ${primaryText} mb-8 text-center`}>
          Step-by-step guide
        </h2>
        <div className="max-w-2xl mx-auto space-y-3 mb-20">
          {steps.map((step, i) => (
            <Step
              key={step.id}
              step={step}
              index={i}
              isOpen={openStep === i}
              onToggle={() => setOpenStep(openStep === i ? null : i)}
            />
          ))}
        </div>

        {/* video placeholder */}


        {/* FAQ */}
        <h2 className={`text-3xl font-bold ${primaryText} mb-8 text-center`}>
          Frequently asked questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border ${defaultBorderColor} overflow-hidden`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full flex items-center justify-between p-5 text-left ${pageBg} transition-colors`}
              >
                <span className={`font-semibold ${primaryText} text-sm pr-4`}>
                  {faq.q}
                </span>
                {openFaq === i ? (
                  <BsChevronDown className={`${mutedText} shrink-0`} />
                ) : (
                  <BsChevronRight className={`${mutedText} shrink-0`} />
                )}
              </button>
              {openFaq === i && (
                <div className={`px-5 pb-5 border-t ${defaultBorderColor}`}>
                  <p className={`${mutedText} text-sm leading-relaxed mt-4`}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* cta */}
      <div className={`${accentBg} py-16 px-6 text-center`}>
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className={`${surfaceBg} text-lg mb-8`}>
          Sign up free and have your first project running in minutes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className={`${surfaceBg} ${accentText} font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors`}
          >
            Sign up free
          </button>
          <button
            onClick={() => navigate('/features')}
            className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            Explore features
          </button>
        </div>
      </div>
    </div>
  )
}

export default KanvoraGuide
