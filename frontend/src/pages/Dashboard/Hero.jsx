
import problems from "../../assets/problems_data.json";
function Hero() {
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
              <th className="px-6 py-4 font-semibold">Acceptance</th>
              <th className="px-6 py-4 font-semibold">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((data, id) => (
              <tr
                key={id}
                className="border-b border-[#333] hover:bg-[#2a2a2a] transition-all duration-200 group cursor-pointer"
              >
                {/* Status Column */}
                <td className="px-6 py-4 text-center">
                  {data.status === "solved" ? (
                    <span className="text-emerald-500 text-lg">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  ) : (
                    <span className="inline-block w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-400 transition-colors"></span>
                  )}
                </td>

                {/* Title Column */}
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="text-gray-200 font-medium group-hover:text-blue-400 transition-colors"
                  >
                    {id + 1}. {data.title}
                  </a>
                </td>

                {/* Acceptance Column */}
                <td className="px-6 py-4 text-gray-400 text-sm font-mono tracking-wide">
                  {data.acceptance}
                </td>

                {/* Difficulty Column */}
                <td
                  className={`px-6 py-4 text-sm font-medium ${getDifficultyClass(
                    data.difficulty
                  )}`}
                >
                  {data.difficulty}
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
