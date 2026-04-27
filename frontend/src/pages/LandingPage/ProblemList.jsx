import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path if needed

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ProblemList() {
  const { token } = useAuth();
  const [problems, setProblems] = useState([]);
  const [solvedSlugs, setSolvedSlugs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch the master list of all problems
        const problemsRes = await fetch(`${API_URL}/api/problems`);
        const problemsData = await problemsRes.json();
        
        let solvedSet = new Set();

        // 2. If the user is logged in, fetch their specific solved history
        if (token) {
          const solvedRes = await fetch(`${API_URL}/api/submissions/solved`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const solvedData = await solvedRes.json();
          
          // Convert the array of slugs ["acronym", "allergies"] into a JavaScript Set
          // We use a Set because checking if a Set has an item is infinitely faster than searching an array!
          if (solvedData.data) {
            solvedSet = new Set(solvedData.data);
          }
        }

        setProblems(problemsData.data || []);
        setSolvedSlugs(solvedSet);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Helper to color-code difficulty
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-[#00b8a3]'; // LeetCode Green
      case 'medium': return 'text-[#ffc01e]'; // LeetCode Yellow
      case 'hard': return 'text-[#ff375f]'; // LeetCode Red
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00b8a3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Problem Set</h1>

        <div className="bg-[#282828] rounded-lg shadow-xl overflow-hidden border border-[#333]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3e3e3e] bg-[#333333] text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 w-16 text-center">Status</th>
                <th className="p-4">Title</th>
                <th className="p-4 w-32">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3e3e3e]">
              {problems.map((problem, index) => {
                const isSolved = solvedSlugs.has(problem.slug);

                return (
                  <tr 
                    key={problem.slug} 
                    className="hover:bg-[#333333] transition-colors group"
                  >
                    {/* The Checkmark Column */}
                    <td className="p-4 text-center">
                      {isSolved && (
                        <i className="fa-solid fa-check text-[#00b8a3] text-lg font-bold shadow-sm"></i>
                      )}
                    </td>

                    {/* The Title Column (Clickable Link to the IDE) */}
                    <td className="p-4 font-medium text-gray-200 group-hover:text-white transition-colors">
                      <Link to={`/problem/${problem.slug}`}>
                        {index + 1}. {problem.title}
                      </Link>
                    </td>

                    {/* The Difficulty Column */}
                    <td className={`p-4 font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}