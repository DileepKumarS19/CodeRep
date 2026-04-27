import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jsxs } from "react/jsx-runtime";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Hero() {

  const [problems, setProblems] = useState([]);
  const [solvedSlugs, setSolvedSlugs] = useState([]);
  const { token, isAuthenticated } = useAuth();

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/problems`);
      const json = await response.json();
      setProblems(json.data);
    } catch (err) {
      console.log("Error fetching problems:", err);
    }
  };

  const fetchSolved = async () => {
    try {
      const response = await fetch(`${API_URL}/api/submissions/solved`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.data) setSolvedSlugs(json.data);
    } catch (err) {
      console.log("Error fetching solved:", err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSolved();
    } else {
      setSolvedSlugs([]);
    }
  }, [isAuthenticated, token]);
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-[#00b8a3]";
      case "Medium":
        return "text-[#ffb800]";
      case "Hard":
        return "text-[#ff2d55]";
      default:
        return "text-gray-400";
    }
  };


  return (
    <div className="overflow-hidden bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-[#333] bg-[#252525]">
              <th className="px-6 py-4 font-semibold w-16 text-center">Status</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems?.map((p, id) => (
              <tr
                key={id}
                className="border-b border-[#333] hover:bg-[#2a2a2a] transition-all duration-200 group cursor-pointer"
              >
                {/* Status Column */}
                <td className="px-6 py-4 text-center">
                  {solvedSlugs.includes(p.slug) ? (
                    <i className="fa-solid fa-check text-[#00b8a3]"></i>
                  ) : (
                    <span className="inline-block w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-400 transition-colors"></span>
                  )}
                </td>

                {/* Title Column */}
                <td className="px-6 py-4">
                  <Link
                    to={`/problem/${p.slug}`}
                    className="text-gray-200 font-medium group-hover:text-blue-400 transition-colors"
                  >
                    {p.title}
                  </Link>
                </td>

                {/* Acceptance Column */}


                {/* Difficulty Column */}
                <td
                  className={`px-6 py-4 text-sm font-medium ${getDifficultyClass(
                    p.difficulty
                  )}`}
                >
                  {p.difficulty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
    
    

  );
}
export default Hero;
