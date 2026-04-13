import problem_description from "../../assets/problem_descrition.json";

function ProblemDescription() {
  const problem = problem_description[0];

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy":
        return "text-[#00b8a3]"; // premium teal
      case "Medium":
        return "text-[#ffc01e]"; // yellow
      case "Hard":
        return "text-[#ff375f]"; // crimson
      default:
        return "text-gray-400";
    }
  };

  // Basic markdown parser for inline code `code` and bold **bold**
  const renderText = (text) => {
    const parts = text.split("`");
    return parts.map((part, i) => {
      // Even indices are regular text (or bold), odd indices are inside backticks
      if (i % 2 === 0) {
        const boldParts = part.split("**");
        return boldParts.map((bPart, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="text-white font-bold">
              {bPart}
            </strong>
          ) : (
            bPart
          )
        );
      } else {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 bg-[#2a2a2a] text-[#00b8a3] rounded-md text-xs font-mono border border-[#333]"
          >
            {part}
          </code>
        );
      }
    });
  };

  return (
    <div className="h-full bg-[#1e1e1e] text-gray-300 overflow-y-auto p-6 md:p-8">
      {/* Title & Meta */}
      <h1 className="text-2xl font-bold text-white mb-4">
        {problem.id}. {problem.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span
          className={`text-xs font-bold ${getDifficultyColor(
            problem.difficulty
          )} bg-white/5 border border-white/5 px-2.5 py-1 rounded-full`}
        >
          {problem.difficulty}
        </span>
        {problem.topics.map((topic, idx) => (
          <span
            key={idx}
            className="text-xs font-medium text-gray-400 bg-[#252525] border border-[#333] hover:text-gray-200 hover:bg-[#333] transition-colors cursor-pointer px-2.5 py-1 rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="text-sm md:text-base leading-loose mb-10 whitespace-pre-line text-gray-300">
        {renderText(problem.description)}
      </div>

      {/* Examples */}
      <div className="flex flex-col gap-8 mb-10">
        {problem.examples.map((ex, index) => (
          <div key={ex.id}>
            <p className="font-bold text-white text-sm mb-3">
              Example {index + 1}:
            </p>
            <div className="bg-[#252525] border-l-4 border-[#00b8a3] rounded-r-lg p-4 font-mono text-xs md:text-sm shadow-md overflow-x-auto selection:bg-blue-500/30">
              <div className="mb-2">
                <span className="text-gray-500 select-none font-bold">Input: </span>
                <span className="text-gray-300">{ex.input}</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-500 select-none font-bold">Output: </span>
                <span className="text-gray-300">{ex.output}</span>
              </div>
              {ex.explanation && (
                <div>
                  <span className="text-gray-500 select-none font-bold">
                    Explanation:{" "}
                  </span>
                  <span className="text-gray-300">{ex.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div className="mb-8">
        <p className="font-bold text-white text-sm mb-4">Constraints:</p>
        <ul className="list-none flex flex-col gap-2">
          {problem.constraints.map((constraint, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-[#333] mt-0.5">•</span>
              <code className="px-1.5 py-0.5 bg-[#252525] text-gray-300 rounded text-xs md:text-sm font-mono border border-[#333]">
                {constraint}
              </code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProblemDescription;