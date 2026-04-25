import {Routes,Route, BrowserRouter} from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Problems from './pages/Dashboard/Problems';
import Auth from './pages/LandingPage/Auth/Auth';
import SolutionPage from './pages/Solution/SolutionPage';
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
                    <Route path="/problems" element={<Problems/>}/>
                    <Route path="/problem/:name" element={<ProtectedRoute><SolutionPage/></ProtectedRoute>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;