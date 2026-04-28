import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

// ALL pages lazy loaded
const LandingPage    = lazy(() => import('./pages/LandingPage/LandingPage'))
const ProblemList    = lazy(() => import('./pages/LandingPage/ProblemList'))
const Auth           = lazy(() => import('./pages/LandingPage/Auth/Auth'))
const SolutionPage   = lazy(() => import('./pages/Solution/SolutionPage'))
const SolvedProblems = lazy(() => import('./pages/SolvedProblems/SolvedProblems'))

// one shared loader — shown during page transitions
const PageLoader = () => (
  <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00b8a3] border-t-transparent rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"         element={<LandingPage />} />
            <Route path="/signin"   element={<Auth />} />
            <Route path="/signup"   element={<Auth />} />
            <Route path="/problems" element={<ProtectedRoute><ProblemList /></ProtectedRoute>} />
            <Route path="/solved"   element={<ProtectedRoute><SolvedProblems /></ProtectedRoute>} />
            <Route path="/problem/:name" element={
              <ProtectedRoute>
                <SolutionPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App