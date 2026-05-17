// common styles: shared Tailwind class tokens for consistent app theming.
// common.js - Single source of truth for ALL Tailwind tokens
// Public (marketing) pages use Apple-inspired light palette
// Dashboard pages use dark Trello palette

// Layout
export const pageBackground = 'bg-white min-h-screen'
export const pageWrapper = 'max-w-6xl mx-auto px-6 py-16'
export const sectionWrapper = 'max-w-6xl mx-auto px-6'

// Home / Hero
export const homeWrapper = 'bg-white min-h-screen'
export const heroSection =
  'flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto px-6 py-20'
export const heroHeading =
  'text-5xl font-bold text-[#1d1d1f] leading-tight mb-5 tracking-tight'
export const heroSubheading = 'text-lg text-[#6e6e73] mb-8 leading-relaxed'
export const heroEmailRow = 'flex gap-3 flex-col sm:flex-row'
export const heroEmailInput =
  'border border-[#d2d2d7] rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition'
export const heroSignupBtn =
  'bg-[#0066cc] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0055b3] transition-colors text-sm whitespace-nowrap'
export const heroPrivacyNote = 'text-xs text-[#6e6e73] mt-3'
export const heroVideo = 'rounded-2xl shadow-2xl w-full max-w-lg'

// Feature highlights (Home page cards row)
export const featureHighlights =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 py-12'
export const featureCard =
  'bg-[#f5f5f7] rounded-2xl p-7 hover:bg-[#ebebf0] transition-colors duration-200 cursor-pointer'
export const featureCardIcon = 'text-3xl text-[#0066cc] mb-4 block'
export const featureCardTitle = 'text-base font-bold text-[#1d1d1f] mb-2'
export const featureCardDesc = 'text-sm text-[#6e6e73] leading-relaxed'

// Features page grid
export const featuresGrid =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
export const featureItemCard =
  'bg-[#f5f5f7] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'
export const featureItemIcon = 'text-4xl text-[#0066cc] mb-4 block'
export const featureItemTitle = 'text-lg font-bold text-[#1d1d1f] mb-2'
export const featureItemDesc = 'text-sm text-[#6e6e73] leading-relaxed'

// Auth (Login / Register)
export const loginContainer =
  'min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4 py-12'
export const loginBox =
  'bg-white rounded-2xl shadow-sm border border-[#e5e5ea] p-8 w-full max-w-sm flex flex-col gap-3'
export const loginInput =
  'w-full border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition'
export const loginBtn =
  'w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#0055b3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
export const errorClass = 'text-xs text-red-500 mt-0.5'

// Notifications page
export const notifPage = 'max-w-2xl mx-auto px-4 py-8'
export const notifHeader = 'flex items-center justify-between mb-4'
export const notifTitle = 'text-xl font-bold text-[#1d1d1f]'
export const notifList = 'flex flex-col divide-y divide-[#f2f2f7]'
export const notifItem =
  'flex items-start gap-3 px-4 py-3.5 hover:bg-[#f9f9f9] transition-colors cursor-pointer'
export const notifItemUnread =
  'flex items-start gap-3 px-4 py-3.5 bg-blue-50/60 hover:bg-blue-50 transition-colors cursor-pointer'
export const notifItemAvatar =
  'w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 mt-0.5'
export const notifItemBody = 'flex-1 min-w-0'
export const notifItemText = 'text-xs leading-relaxed text-[#1d1d1f]'
export const notifItemTime = 'text-[10px] text-[#a1a1a6] mt-0.5'
export const notifEmptyState =
  'flex flex-col items-center justify-center py-20 text-center'

// User Profile
export const profilePage =
  'min-h-screen bg-[#f5f5f7] flex items-start justify-center px-4 py-12'
export const profileCard =
  'bg-white rounded-2xl shadow-sm border border-[#e5e5ea] p-8 w-full max-w-lg flex flex-col items-center'
export const profileAvatarWrap = 'flex flex-col items-center mb-2'
export const profileAvatar = ''
export const profileName = 'text-xl font-bold text-[#1d1d1f] mt-3'
export const profileEmail = 'text-sm text-[#6e6e73]'
export const profileSection = 'w-full'
export const profileSectionTitle = 'text-sm font-semibold text-[#1d1d1f]'
export const profileFormGroup = 'flex flex-col gap-1'
export const profileLabel = 'text-xs font-medium text-[#6e6e73]'
export const profileInput =
  'w-full border border-[#d2d2d7] rounded-xl px-3 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] disabled:bg-[#f5f5f7] disabled:border-transparent disabled:cursor-default transition'
export const profileSaveBtn =
  'bg-[#0066cc] hover:bg-[#0055b3] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-full transition-colors cursor-pointer text-sm'

// General buttons
export const primaryBtn =
  'bg-[#0066cc] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#0055b3] transition-colors cursor-pointer text-sm'
export const secondaryBtn =
  'border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2 rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer text-sm'
export const dangerBtn =
  'bg-red-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer text-sm'

// Cards / containers
export const cardClass =
  'bg-[#f5f5f7] rounded-2xl p-7 hover:bg-[#ebebf0] transition-colors duration-200 cursor-pointer'
export const cardTitle = 'text-base font-bold text-[#1d1d1f] mb-1'
export const cardDesc = 'text-sm text-[#6e6e73] leading-relaxed'

// Form helpers
export const formCard = 'bg-[#f5f5f7] rounded-2xl p-10 max-w-4xl mx-auto'
export const formTitle =
  'text-2xl font-bold text-[#1d1d1f] tracking-tight text-center mb-7'
export const formGroup = 'mb-4'
export const labelClass = 'text-xs font-medium text-[#6e6e73] mb-1.5 block'
export const inputClass =
  'w-full bg-white border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition'
export const submitBtn =
  'w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#0055b3] transition-colors cursor-pointer mt-2 text-sm'

// Feedback / status
export const loadingClass =
  'text-[#0066cc]/60 text-sm animate-pulse text-center py-10'
export const emptyState = 'text-center py-20 text-[#6e6e73] text-sm'

// Dashboard (dark Trello palette)
export const dashboardBg = 'bg-[#1d2125]'
export const dashboardCard =
  'bg-[#2c333a] rounded-xl hover:bg-[#353d47] transition-colors'
export const dashboardText = 'text-[#b6c2cf]'
export const dashboardMuted = 'text-[#9fadbc]'
export const dashboardBorder = 'border border-[#454f59]'
export const dashboardBtn =
  'flex items-center gap-1.5 px-3 h-8 rounded text-xs text-[#b6c2cf] border border-[#454f59] hover:bg-[#454f59] hover:text-white transition-colors'
export const dashboardPrimaryBtn =
  'flex items-center gap-2 px-4 h-9 rounded bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold transition-colors'

// Board workspace
export const projectFallbackBg = 'bg-[#1d2125]'
export const projectHeader =
  'flex items-center justify-between px-4 py-2 bg-black/20 backdrop-blur-sm shrink-0'
export const projectHeaderBtn =
  'text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1'
export const projectHeaderTitle = 'text-white font-bold text-base'
export const projectShareBtn =
  'flex items-center gap-1.5 px-3 h-7 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors'
export const projectCanvas = 'flex-1 overflow-x-auto overflow-y-hidden px-4 py-3'
export const projectListRow = 'flex gap-3 h-full items-start'
export const projectStatusBar =
  'flex items-center gap-2 px-4 py-2 bg-black/10 border-b border-white/10 shrink-0 overflow-x-auto'
export const projectStatusBarLabel =
  'text-[10px] font-bold uppercase text-white/60 whitespace-nowrap'
export const projectStatusPillBase =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors'
export const projectStatusPillActive = 'ring-2 ring-white/30'
export const listColumnBase =
  'rounded-xl w-64 shrink-0 flex flex-col max-h-full select-none border'
export const listColumnDefault = 'bg-[#101204] border-transparent'
export const listHeader =
  'flex items-center justify-between px-3 pt-3 pb-2 cursor-grab active:cursor-grabbing'
export const listTitle =
  'text-sm font-semibold text-[#b6c2cf] flex-1 cursor-pointer hover:text-white'
export const listTitleInput =
  'bg-[#2c333a] border border-[#579dff] rounded px-2 py-0.5 text-sm text-white focus:outline-none flex-1 mr-1'
export const listIconButton =
  'text-[#9fadbc] hover:text-white p-1 rounded hover:bg-[#2c333a] transition-colors'
export const listMenu =
  'absolute right-0 top-7 z-20 bg-[#2c333a] border border-[#454f59] rounded-lg shadow-lg py-1 w-48'
export const listMenuItem =
  'w-full text-left px-3 py-2 text-xs text-[#b6c2cf] hover:bg-[#454f59]'
export const listMenuDanger =
  'w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#454f59]'
export const listDropZone =
  'flex flex-col gap-2 px-2 overflow-y-auto flex-1 pb-2 min-h-1 transition-colors rounded-lg'
export const listDropZoneOver = 'bg-[#ffffff08]'
export const addListPanel = 'bg-[#101204] rounded-xl w-64 shrink-0 p-3'
export const addListButton =
  'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl w-64 shrink-0 px-3 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors'
export const projectInput =
  'w-full bg-[#22272b] border border-[#579dff] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#9fadbc] focus:outline-none'
export const projectTextarea =
  'w-full bg-[#22272b] border border-[#579dff] rounded-lg p-2.5 text-sm text-white placeholder:text-[#9fadbc] focus:outline-none resize-none'
export const projectPrimarySmallBtn =
  'bg-[#579dff] hover:bg-[#85b8ff] disabled:opacity-50 text-[#1d2125] text-xs font-semibold px-3 py-1.5 rounded transition-colors'
export const projectMutedIconBtn = 'text-[#9fadbc] hover:text-white'
export const cardSurface =
  'bg-[#22272b] hover:bg-[#2c333a] rounded-lg p-3 cursor-pointer group relative transition-colors select-none'
export const cardText =
  'text-sm text-[#b6c2cf] group-hover:text-white transition-colors leading-relaxed'
export const cardDeleteBtn =
  'opacity-0 group-hover:opacity-100 text-[#9fadbc] hover:text-red-400 transition-all p-0.5 rounded shrink-0'
export const cardOverlay = 'bg-[#22272b] rounded-lg p-3 shadow-2xl rotate-2 w-64 opacity-90'
export const cardMetaText = 'text-[10px] text-[#9fadbc] mt-1.5 flex items-center gap-1'
export const modalBackdrop =
  'fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-12 px-4'
export const modalPanel =
  'bg-[#323940] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden'
export const modalHeader =
  'bg-[#2c333a] px-6 py-4 flex items-start justify-between gap-3'
export const modalTitleInput =
  'w-full bg-transparent text-white text-lg font-semibold resize-none focus:outline-none focus:bg-[#1d2125] rounded p-1 -ml-1'
export const modalMutedText = 'text-xs text-[#9fadbc]'
export const modalSectionTitle = 'text-sm font-semibold text-[#b6c2cf]'
export const modalTextarea =
  'w-full bg-[#2c333a] border border-[#454f59] rounded-lg px-3 py-2 text-sm text-[#b6c2cf] placeholder:text-[#9fadbc] focus:outline-none focus:border-[#579dff] resize-none'
export const modalActionBtn =
  'flex items-center gap-2 px-3 py-1.5 rounded bg-[#2c333a] hover:bg-[#454f59] text-xs text-[#b6c2cf] hover:text-white transition-colors text-left'
export const modalDangerBtn =
  'flex items-center gap-2 px-3 py-1.5 rounded bg-[#2c333a] hover:bg-red-900/40 text-xs text-red-400 transition-colors text-left'
export const modalPrimaryBtn =
  'bg-[#579dff] hover:bg-[#85b8ff] disabled:opacity-50 text-[#1d2125] text-sm font-semibold px-4 py-2 rounded transition-colors'
export const modalCancelBtn =
  'text-[#9fadbc] hover:text-white text-sm px-4 py-2 rounded hover:bg-[#2c333a] transition-colors'

export const statusLabelStyles = {
  todo: {
    title: 'Todo',
    label: 'todo',
    listTitle: 'Todo',
    taskStatus: 'TO-DO',
    color: '#38bdf8',
    pill: 'bg-sky-500/20 border-sky-400/50 text-sky-200 hover:bg-sky-500/30',
    badge: 'bg-sky-400 text-[#102033]',
    list: 'bg-sky-950/40 border-sky-500/35'
  },
  inProgress: {
    title: 'In Progress',
    label: 'in progress',
    listTitle: 'In Progress',
    taskStatus: 'IN-PROGRESS',
    color: '#fcd34d',
    pill:
      'bg-amber-500/20 border-amber-400/50 text-amber-200 hover:bg-amber-500/30',
    badge: 'bg-amber-300 text-[#32230d]',
    list: 'bg-amber-950/35 border-amber-500/35'
  },
  done: {
    title: 'Done',
    label: 'done',
    listTitle: 'Done',
    taskStatus: 'DONE',
    color: '#6ee7b7',
    pill:
      'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30',
    badge: 'bg-emerald-300 text-[#0e2a1d]',
    list: 'bg-emerald-950/35 border-emerald-500/35'
  }
}

// Pricing page
export const pricingCard =
  'bg-white rounded-2xl border border-[#e5e5ea] p-8 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
export const pricingCardFeatured =
  'bg-[#0066cc] rounded-2xl p-8 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white'

// Sidebar (dark)
export const sidebarLink =
  'flex items-center gap-2.5 px-3 h-9 rounded text-sm font-medium w-full text-left transition-colors text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white'
export const sidebarLinkActive =
  'flex items-center gap-2.5 px-3 h-9 rounded text-sm font-medium w-full text-left transition-colors bg-[#85b8ff1a] text-[#579dff]'

// Navbar (dark)
export const navbarWrap =
  'flex items-center h-12 px-2 gap-1 bg-[#1d2125] border-b border-[#2c333a] sticky top-0 z-40'
export const navbarBtn =
  'flex items-center gap-1 px-2.5 h-8 rounded text-[#b6c2cf] hover:bg-[#2c333a] hover:text-white text-sm font-medium transition-colors'
export const navbarCreateBtn =
  'flex items-center gap-1.5 px-3 h-8 rounded bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] text-sm font-semibold transition-colors'
export const navbarIconBtn =
  'flex items-center justify-center w-8 h-8 rounded hover:bg-[#2c333a] text-[#9fadbc] hover:text-white transition-colors'

// Workspace / Templates (dark pages with their own sidebar)
export const darkPageWrap =
  'flex h-screen w-screen overflow-hidden bg-[#1d2125]'
export const darkSidebar =
  'w-56 shrink-0 border-r border-[#2c333a] py-4 overflow-y-auto'
export const darkSidebarLink =
  'text-left px-3 py-1.5 rounded text-sm transition-colors text-[#9fadbc] hover:bg-[#2c333a] hover:text-white'
export const darkSidebarLinkActive =
  'text-left px-3 py-1.5 rounded text-sm transition-colors bg-[#85b8ff1a] text-[#579dff] font-medium'
export const darkMain = 'flex-1 overflow-y-auto px-8 py-6'



