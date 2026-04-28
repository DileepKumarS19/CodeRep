import {Routes,Route, BrowserRouter} from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import ProblemList from './pages/LandingPage/ProblemList';
import Auth from './pages/LandingPage/Auth/Auth';
import SolutionPage from './pages/Solution/SolutionPage';
import SolvedProblems from './pages/SolvedProblems/SolvedProblems';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App(){
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/signin" element={<Auth/>}/>
                    <Route path="/signup" element={<Auth/>}/>
                    <Route path="/problems" element={<ProtectedRoute><ProblemList/></ProtectedRoute>}/>
                    <Route path="/problem/:name" element={<ProtectedRoute><SolutionPage/></ProtectedRoute>}/>
                    <Route path="/solved" element={<ProtectedRoute><SolvedProblems/></ProtectedRoute>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;