import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import NavbarWithAuth from "../Navbar/NavbarWithAuth";

export default function SolvedProblems() {
  const { token } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/submissions/solved", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (res.ok) {
          setSolvedProblems(json.data || []);
        } else {
          console.error("Error fetching solved problems", json);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
        fetchSolvedProblems();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30 flex flex-col">
      <NavbarWithAuth />
      
      <div className="flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-8 border-b border-[#3a3a3a] pb-4">Solved Problems</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[#3a3a3a] border-t-[#ffa116] rounded-full animate-spin"></div>
            </div>
          ) : solvedProblems.length > 0 ? (
            <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl overflow-hidden shadow-2xl">
                <ul className="divide-y divide-[#3a3a3a]">
                {solvedProblems.map((slug) => (
                    <li key={slug} className="group hover:bg-[#282828] transition-colors">
                    <Link 
                        to={`/problem/${slug}`} 
                        className="flex items-center gap-4 p-5 w-full"
                    >
                        <div className="text-[#ffa116] bg-[#ffa116]/10 p-2 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        </div>
                        <div className="flex-1">
                            <span className="text-lg text-gray-200 group-hover:text-white transition-colors capitalize font-semibold">
                                {slug.replace(/-/g, ' ')}
                            </span>
                        </div>
                        <div className="text-gray-500 group-hover:text-[#ffa116] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
          ) : (
            <div className="text-center py-20 bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl shadow-2xl">
              <div className="text-gray-600 mb-4 flex justify-center">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                 </svg>
              </div>
              <p className="text-xl text-gray-300">No solved problems yet.</p>
              <p className="text-gray-500 mt-2">Start practicing to build your streak!</p>
              <Link to="/problems" className="inline-block mt-6 px-6 py-2 bg-[#ffa116] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#e08e13] transition-colors">
                Explore Problems
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
