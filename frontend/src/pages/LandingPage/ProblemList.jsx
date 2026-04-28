import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavbarWithAuth from "../Navbar/NavbarWithAuth";
import NavbarWithoutAuth from "../Navbar/NavbarWithoutAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Skeleton row shown while loading ────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-[#2a2a2a]">
    <td className="px-6 py-4 text-center">
      <div className="w-4 h-4 rounded-full bg-[#2a2a2a] animate-pulse mx-auto" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-[#2a2a2a] rounded animate-pulse w-48" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-[#2a2a2a] rounded animate-pulse w-16" />
    </td>
  </tr>
);

// ─── Difficulty badge ─────────────────────────────────────────────────────────
const DIFFICULTY_STYLES = {
  easy:   "text-[#00b8a3]",
  medium: "text-[#ffb800]",
  hard:   "text-[#ff2d55]",
};

const getDifficultyClass = (difficulty = "") =>
  DIFFICULTY_STYLES[difficulty.toLowerCase()] ?? "text-gray-400";

// ─── Main component ───────────────────────────────────────────────────────────
function ProblemList() {
  const { token, isAuthenticated } = useAuth();

  const [problems, setProblems]     = useState([]);
  const [solvedSlugs, setSolvedSlugs] = useState(new Set()); // Set for O(1) lookup
  const [isLoading, setIsLoading]   = useState(true);

  // Filter state
  const [search, setSearch]         = useState("");
  const [difficulty, setDifficulty] = useState("all");

  // ── Fetch problems + solved list ──────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Always fetch problems
        const problemsRes  = await fetch(`${API_URL}/api/problems`);
        const problemsJson = await problemsRes.json();
        setProblems(problemsJson.data || []);

        // Only fetch solved if logged in
        if (isAuthenticated && token) {
          const solvedRes  = await fetch(`${API_URL}/api/submissions/solved`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const solvedJson = await solvedRes.json();
          setSolvedSlugs(new Set(solvedJson.data || []));
        } else {
          setSolvedSlugs(new Set());
        }
      } catch (err) {
        console.error("Failed to load problems:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  // ── Filter + search (client-side, instant) ────────────────────────────────
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesDifficulty =
        difficulty === "all" ||
        p.difficulty?.toLowerCase() === difficulty.toLowerCase();

      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase().trim());

      return matchesDifficulty && matchesSearch;
    });
  }, [problems, difficulty, search]);

  // ── Stats for the header ──────────────────────────────────────────────────
  const solvedCount = problems.filter((p) => solvedSlugs.has(p.slug)).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
      {isAuthenticated ? <NavbarWithAuth /> : <NavbarWithoutAuth />}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Problems</h1>
            <p className="mt-1 text-sm text-gray-500">
              Solve challenges to sharpen your algorithmic skills.
            </p>
          </div>

          {/* Solved counter — only shown when logged in */}
          {isAuthenticated && !isLoading && (
            <div className="flex items-center gap-2 bg-[#1e1e1e] border border-[#333] rounded-lg px-4 py-2 self-start sm:self-auto">
              <i className="fa-solid fa-circle-check text-[#00b8a3] text-sm" />
              <span className="text-sm text-gray-400">
                <span className="text-white font-bold">{solvedCount}</span>
                {" / "}
                <span className="text-white font-bold">{problems.length}</span>
                {" solved"}
              </span>
            </div>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-gray-500 text-sm" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#1e1e1e] border border-[#333] rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#00b8a3] focus:ring-1 focus:ring-[#00b8a3] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                  difficulty === d
                    ? d === "all"
                      ? "bg-[#00b8a3]/10 text-[#00b8a3] border-[#00b8a3]/40"
                      : d === "easy"
                      ? "bg-[#00b8a3]/10 text-[#00b8a3] border-[#00b8a3]/40"
                      : d === "medium"
                      ? "bg-[#ffb800]/10 text-[#ffb800] border-[#ffb800]/40"
                      : "bg-[#ff2d55]/10 text-[#ff2d55] border-[#ff2d55]/40"
                    : "bg-transparent text-gray-500 border-[#333] hover:border-gray-500 hover:text-gray-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count ── */}
        {!isLoading && (
          <p className="text-xs text-gray-600 mb-3">
            {filteredProblems.length === problems.length
              ? `${problems.length} problems`
              : `${filteredProblems.length} of ${problems.length} problems`}
          </p>
        )}

        {/* ── Table ── */}
        <div className="overflow-hidden bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-[#333] bg-[#252525] uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-semibold w-16 text-center">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Title</th>
                  <th className="px-6 py-3.5 font-semibold">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {/* Loading skeletons */}
                {isLoading &&
                  Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}

                {/* No results */}
                {!isLoading && filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center text-gray-500">
                      <i className="fa-solid fa-magnifying-glass text-2xl mb-3 block text-gray-700" />
                      {search
                        ? `No problems match "${search}"`
                        : "No problems found."}
                    </td>
                  </tr>
                )}

                {/* Problem rows */}
                {!isLoading &&
                  filteredProblems.map((p, index) => {
                    const isSolved = solvedSlugs.has(p.slug);
                    return (
                      <tr
                        key={p.slug}  // ← slug not array index
                        className="border-b border-[#2a2a2a] hover:bg-[#252525] transition-all duration-150 group cursor-pointer"
                      >
                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          {isSolved ? (
                            <i className="fa-solid fa-check text-[#00b8a3]" />
                          ) : (
                            <span className="inline-block w-4 h-4 rounded-full border border-gray-700 group-hover:border-gray-500 transition-colors" />
                          )}
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/problem/${p.slug}`}
                            className="text-gray-200 font-medium group-hover:text-[#00b8a3] transition-colors"
                          >
                            {index + 1}. {p.title}
                          </Link>
                        </td>

                        {/* Difficulty */}
                        <td className={`px-6 py-4 text-sm font-semibold ${getDifficultyClass(p.difficulty)}`}>
                          {p.difficulty
                            ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProblemList;