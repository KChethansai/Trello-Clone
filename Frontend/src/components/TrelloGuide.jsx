// TrelloGuide component: renders a focused piece of the Trello clone UI.
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
    desc: 'A Trello project represents a project or workflow. Think of it as a whiteboard filled with lists of cards.',
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
    desc: 'Collaboration is where Trello shines. Invite teammates, assign cards, and track progress together.',
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
    title: 'Automate with Butler',
    color: 'from-amber-400 to-orange-500',
    desc: "Butler is Trello's built-in automation engine. No code required - just tell it what to do.",
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
    title: 'Add Power-Ups',
    color: 'from-emerald-400 to-green-600',
    desc: 'Power-Ups connect Trello to your favourite apps - Slack, Google Drive, GitHub, Figma, and 200+ more.',
    details: [
      'Open project menu -> Power-Ups',
      'Popular: Slack, Google Drive, GitHub, Figma, Jira',
      'Calendar Power-Up to see due dates in a calendar view',
      'Custom Fields to add metadata to any card'
    ]
  }
]

const faqs = [
  {
    q: 'Is Trello free?',
    a: 'Yes! Trello has a generous free tier with unlimited cards, up to 10 projects per workspace, and access to iOS and Android apps. Paid plans unlock unlimited projects, advanced automations, and more Power-Ups.'
  },
  {
    q: 'Can I use Trello for personal projects?',
    a: 'Absolutely. Trello works great as a personal task manager, reading list, travel planner, or habit tracker. Many of our users start with personal projects before bringing their teams onboard.'
  },
  {
    q: 'How is Trello different from Jira?',
    a: 'Trello is visual, flexible, and easy to set up in minutes - ideal for any team or workflow. Jira is built specifically for software development with advanced issue tracking and reporting. They work great together via the Jira Power-Up.'
  },
  {
    q: 'Can I import data from other tools?',
    a: 'Yes. You can import projects from Asana, CSV files, and other tools via the project settings. Trello also supports a full REST API for custom migrations.'
  },
  {
    q: 'Is my data secure?',
    a: 'Trello uses industry-standard TLS encryption in transit and AES-256 at rest. As an Atlassian product, it meets SOC 2 Type II and ISO 27001 standards.'
  }
]

function Step({ step, index, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div
          className={`w-10 h-10 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center text-white text-lg shrink-0`}
        >
          {step.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Step {index + 1}
          </p>
          <h3 className="font-bold text-gray-900">{step.title}</h3>
        </div>
        {isOpen ? (
          <BsChevronDown className="text-gray-400 shrink-0" />
        ) : (
          <BsChevronRight className="text-gray-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-50">
          <p className="text-gray-500 text-sm mt-4 mb-4 leading-relaxed">
            {step.desc}
          </p>
          <ul className="space-y-2">
            {step.details.map((detail, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <BsCheckCircleFill className="text-green-400 mt-0.5 shrink-0 text-xs" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TrelloGuide() {
  const navigate = useNavigate()
  const [openStep, setOpenStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="bg-white">
      {/* hero */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 py-24 px-6 text-center">
        <h1 className="text-5xl font-bold text-white mb-5">
          Getting Started with Trello
        </h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
          Everything you need to go from zero to productive in under 10 minutes.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Create your free account
        </button>
      </div>

      {/* overview cards */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-blue-950 text-center mb-3">
          How Trello works
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Trello uses three core building blocks - projects, lists, and cards - to
          help you visualise and manage any workflow.
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
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* step-by-step accordion */}
        <h2 className="text-3xl font-bold text-blue-950 mb-8 text-center">
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
        <div className="bg-linear-to-br from-blue-950 to-blue-800 rounded-3xl p-12 text-center mb-20">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5 cursor-pointer hover:bg-white/30 transition-colors">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-14 border-l-white ml-1" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Watch: Trello in 5 minutes
          </h3>
          <p className="text-blue-200 text-sm">
            A quick walkthrough of projects, lists, cards, and automations.
          </p>
        </div>

        {/* FAQ */}
        <h2 className="text-3xl font-bold text-blue-950 mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-blue-950 text-sm pr-4">
                  {faq.q}
                </span>
                {openFaq === i ? (
                  <BsChevronDown className="text-gray-400 shrink-0" />
                ) : (
                  <BsChevronRight className="text-gray-400 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <p className="text-gray-500 text-sm leading-relaxed mt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* cta */}
      <div className="bg-blue-600 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Sign up free and have your first project running in minutes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
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

export default TrelloGuide


