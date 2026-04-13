import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Group, Panel, Separator } from "react-resizable-panels";

const STARTER_CODE = {
  python: `def solution(nums):\n    # your code here\n    pass\n`,
  javascript: `function solution(nums) {\n    // your code here\n}\n`,
  java: `class Solution {\n    public int[] solution(int[] nums) {\n        // your code here\n    }\n}\n`,
  cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // your code here\n    }\n};\n`
};

function Ide() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  
  // Console state
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");

  // when language changes, reset the editor to the starter template
  useEffect(() => {
    setCode(STARTER_CODE[language]);
  }, [language]);

  const handleRun = () => {
    setConsoleOutput('Compiling code...\nRunning test cases...\n\nStatus: Accepted\nRuntime: 1ms');
    setShowConsole(true);
  };

  const handleSubmit = () => {
    setConsoleOutput('Submitting solution...\nEvaluating all hidden cases...\n\nStatus: Success!');
    setShowConsole(true);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Editor Header / Language Selector */}
      <div className="h-12 bg-[#252525] border-b border-[#333] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
           <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#1e1e1e] border border-[#333] text-gray-300 text-xs font-semibold rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00b8a3] focus:ring-1 focus:ring-[#00b8a3] cursor-pointer"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
             onClick={handleRun}
             className="bg-[#2d2d2d] hover:bg-[#333] text-gray-300 px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 border border-[#333]">
             <i className="fa-solid fa-play text-[#00b8a3]"></i> Run
          </button>
          <button 
             onClick={handleSubmit}
             className="bg-[#00b8a3] hover:bg-[#009688] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5">
             <i className="fa-solid fa-cloud-arrow-up"></i> Submit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <Group orientation="vertical">
          
          {/* TOP PANEL: MONACO EDITOR */}
          <Panel defaultSize={showConsole ? 60 : 100} minSize={30}>
            <div className="relative h-full w-full">
              <div className="absolute inset-0 pt-2">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value)}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },       // minimap is distracting, turn it off
                    scrollBeyondLastLine: false,        // don't let user scroll into empty space
                    automaticLayout: true,              // resizes editor when panel resizes
                    tabSize: 4,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'line',
                    cursorBlinking: 'smooth',
                  }}
                />
              </div>
            </div>
          </Panel>

          {/* VERTICAL DRAG HANDLE - Conditionally Rendered */}
          {showConsole && (
            <Separator className="h-1.5 bg-[#0a0a0a] hover:bg-[#00b8a3] transition-colors cursor-row-resize flex items-center justify-center border-y border-[#1e1e1e]">
               <div className="w-8 h-0.5 bg-[#444] rounded-full"></div>
            </Separator>
          )}

          {/* BOTTOM PANEL: CONSOLE - Conditionally Rendered */}
          {showConsole && (
            <Panel defaultSize={40} minSize={10}>
              <div className="h-full bg-[#1e1e1e] flex flex-col">
                <div className="h-10 bg-[#252525] border-b border-t border-[#333] flex items-center px-4 justify-between shrink-0">
                   <button className="text-gray-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-2 border-b-2 border-[#00b8a3] h-full px-2">
                      <i className="fa-solid fa-terminal"></i> Console
                   </button>
                   <button 
                      onClick={() => setShowConsole(false)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-6 h-6 rounded hover:bg-[#333]"
                      title="Close Console"
                   >
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                   </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-xs md:text-sm text-gray-400 font-mono tracking-wide whitespace-pre-line">
                  <span className="text-[#00b8a3] font-bold">➜</span> {consoleOutput}
                </div>
              </div>
            </Panel>
          )}
          
        </Group>
      </div>
    </div>
  );
}

export default Ide;