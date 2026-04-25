import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  StarIcon, 
  ChatBubbleBottomCenterTextIcon,
  TagIcon
} from "@heroicons/react/24/outline";

function ProblemDescription({ problem }) {

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return { text: "text-[#00b8a3]", bg: "bg-[#00b8a3]/10" };
      case "medium":
        return { text: "text-[#ffc01e]", bg: "bg-[#ffc01e]/10" };
      case "hard":
        return { text: "text-[#ff375f]", bg: "bg-[#ff375f]/10" };
      default:
        return { text: "text-gray-400", bg: "bg-gray-400/10" };
    }
  };

  if (!problem) {
    return (
      <div className="h-full bg-[#262626] p-6 text-white overflow-y-auto w-full">
        <div className="animate-pulse space-y-5">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-white/5 rounded-full w-16"></div>
            <div className="h-6 bg-white/5 rounded-md w-12"></div>
            <div className="h-6 bg-white/5 rounded-md w-12"></div>
          </div>
          <div className="space-y-3 mt-8">
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
            <div className="h-4 bg-white/5 rounded w-4/6"></div>
          </div>
          <div className="h-24 bg-white/5 rounded w-full mt-6"></div>
        </div>
      </div>
    );
  }

  const diffCls = getDifficultyColor(problem.difficulty);

  return (
    <div className="h-full bg-[#262626] text-gray-300 overflow-y-auto px-6 py-5 cs-scrollbar flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        .prose :where(code):not(:where([class~="not-prose"] *))::before { content: none; }
        .prose :where(code):not(:where([class~="not-prose"] *))::after { content: none; }
        
        /* Custom UI scrollbar matching Leetcode dark mode */
        .cs-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .cs-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .cs-scrollbar::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 20px;
          border: 2px solid #262626;
        }
        .cs-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #888;
        }
      `}} />
      
      {/* Header Container */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-[22px] font-semibold text-gray-100 mb-3 tracking-tight">
          {problem.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty */}
          <span
            className={`text-xs font-semibold capitalize ${diffCls.text} bg-white/5 px-3 py-1 rounded-full border border-transparent hover:border-white/10 transition-colors cursor-default`}
          >
            {problem.difficulty}
          </span>

          {/* Topics Mocking if exists */}
          {problem.topics && problem.topics.length > 0 && (
             <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
               <TagIcon className="w-3.5 h-3.5 text-gray-400" />
               <span className="text-xs text-gray-400 font-medium">Topics</span>
             </div>
          )}

          {/* Action Icons Panel */}
          <div className="flex items-center gap-1 border-l border-[#444] pl-3 ml-1">
            <button className="flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-green-500 hover:bg-white/10 transition group" title="Like">
              <HandThumbUpIcon className="w-4 h-4 group-active:scale-90 transition-transform" />
            </button>
            <button className="flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-white/10 transition group" title="Dislike">
              <HandThumbDownIcon className="w-4 h-4 group-active:scale-90 transition-transform" />
            </button>
            <button className="flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-yellow-400 hover:bg-white/10 transition group" title="Star">
              <StarIcon className="w-4 h-4 group-active:scale-90 transition-transform" />
            </button>
            <button className="flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-blue-400 hover:bg-white/10 transition group" title="Discuss">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4 group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Description Content */}
      <div className="prose prose-invert max-w-none text-gray-300 flex-grow
        prose-p:text-[15px] prose-p:leading-relaxed prose-p:tracking-normal prose-p:mb-5
        prose-headings:font-semibold prose-headings:text-gray-100 prose-headings:mt-8 prose-headings:mb-5
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-100 prose-strong:font-semibold
        prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:mb-5
        prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2 prose-ol:mb-5
        prose-li:text-[15px] prose-li:leading-relaxed prose-li:pl-2
        prose-code:text-[#c9d1d9] prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px] prose-code:font-medium
        prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:text-[13px] prose-pre:p-4 prose-pre:my-6 prose-pre:shadow-sm
        prose-blockquote:border-l-4 prose-blockquote:border-[#555] prose-blockquote:bg-white/5 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-md prose-blockquote:italic prose-blockquote:mb-5
        prose-table:w-full prose-table:text-left prose-table:border-collapse prose-table:mb-5
        prose-th:border prose-th:border-[#444] prose-th:px-4 prose-th:py-2 prose-th:bg-white/5 prose-th:font-semibold prose-th:text-gray-200
        prose-td:border prose-td:border-[#444] prose-td:px-4 prose-td:py-2
        prose-hr:border-[#444] prose-hr:my-8
      ">
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
        >
          {problem.description}
        </ReactMarkdown>
      </div>

      {/* Topics Expansion Area */}
      {problem.topics && problem.topics.length > 0 && (
        <div className="mt-12 pt-6 border-t border-[#333] pb-8 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <TagIcon className="w-4 h-4" /> Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {problem.topics.map((topic, index) => (
              <span
                key={index}
                className="text-[13px] bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-transparent hover:border-white/10 shadow-sm"
               >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDescription;