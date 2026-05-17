// App router: declares the public, auth, dashboard, and board routes.
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import RootLayout from './components/RootLayout'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

const Features = lazy(() => import('./components/Features'))
const Solutions = lazy(() => import('./components/Solutions'))
const Resources = lazy(() => import('./components/Resources'))
const Templates = lazy(() => import('./components/Templates'))
const Engineering = lazy(() => import('./components/Engineering'))
const Design = lazy(() => import('./components/Design'))
const TeamManagement = lazy(() => import('./components/TeamManagement'))
const AboutTrello = lazy(() => import('./components/AboutTrello'))
const CustomerStories = lazy(() => import('./components/CustomerStories'))
const TrelloGuide = lazy(() => import('./components/TrelloGuide'))
const Inbox = lazy(() => import('./components/Inbox'))
const Planner = lazy(() => import('./components/Planner'))
const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const AuthRedirect = lazy(() => import('./components/AuthRedirect'))
const MainPage = lazy(() => import('./components/MainPage'))
const Project = lazy(() => import('./components/Project'))
const WorkSpaces = lazy(() => import('./components/WorkSpaces'))
const Settings = lazy(() => import('./components/Settings'))
const Notifications = lazy(() => import('./components/Notifications'))
const UserProfile = lazy(() => import('./components/UserProfile'))
const TemplateDetail = lazy(() => import('./components/TemplateDetail'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d2125]">
      <div className="w-8 h-8 border-2 border-[#579dff] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold text-blue-950 mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to home
        </a>
      </div>
    </div>
  )
}

const withSuspense = (element) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'features', element: withSuspense(<Features />) },
      { path: 'solutions', element: withSuspense(<Solutions />) },
      { path: 'resources', element: withSuspense(<Resources />) },
      { path: 'engineering', element: withSuspense(<Engineering />) },
      { path: 'design', element: withSuspense(<Design />) },
      { path: 'team-management', element: withSuspense(<TeamManagement />) },
      { path: 'about', element: withSuspense(<AboutTrello />) },
      { path: 'customer-stories', element: withSuspense(<CustomerStories />) },
      { path: 'guide', element: withSuspense(<TrelloGuide />) },
      { path: 'inbox', element: withSuspense(<Inbox />) },
      { path: 'planner', element: withSuspense(<Planner />) },
      { path: 'login', element: withSuspense(<Login />) },
      { path: 'auth', element: withSuspense(<AuthRedirect />) },
      { path: 'register', element: withSuspense(<Register />) },
      {
        path: 'workspaces',
        element: <ProtectedRoute>{withSuspense(<WorkSpaces />)}</ProtectedRoute>
      },
  
// in the router, right after the templates route
{
  path: 'templates',
  element: <ProtectedRoute>{withSuspense(<Templates />)}</ProtectedRoute>
},
{
  path: 'templates/:id',   // ← add this
  element: <ProtectedRoute>{withSuspense(<TemplateDetail />)}</ProtectedRoute>
},

      {
        path: 'main-page',
        element: <ProtectedRoute>{withSuspense(<MainPage />)}</ProtectedRoute>,
        children: [
          { path: 'settings', element: withSuspense(<Settings />) },
          { path: 'settings/:section', element: withSuspense(<Settings />) },
          { path: 'notifications', element: withSuspense(<Notifications />) },
          { path: 'profile', element: withSuspense(<UserProfile />) }
        ]
      },
      {
        path: 'projects/:projectId',
        element: <ProtectedRoute>{withSuspense(<Project />)}</ProtectedRoute>
      },
      { path: '*', element: withSuspense(<NotFound />) }
    ]
  }
])

function App() {
  return (
    <>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2c333a',
            color: '#b6c2cf',
            border: '1px solid #454f59',
            borderRadius: '12px',
            fontSize: '13px'
          },
          success: { iconTheme: { primary: '#579dff', secondary: '#1d2125' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1d2125' } }
        }}
      />
    </>
  )
}

export default App


