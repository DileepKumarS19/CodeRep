import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { io } from "socket.io-client"; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const socket = io(API_URL);

const stripAnsi = (str) => {
  if (!str) return '';
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

const LoadingState = ({ action }) => {
  const messages = action === 'run' 
    ? ["Compiling your code...", "Running test cases...", "Evaluating results...", "Almost done..."] 
    : ["Submitting your solution...", "Running hidden tests...", "Checking edge cases...", "Finalizing results..."];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 1500); 
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 text-center mt-2">
      <div className="relative flex justify-center items-center w-12 h-12">
        <div className="absolute inset-0 border-4 border-[#00b8a3]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#00b8a3] rounded-full border-t-transparent animate-spin"></div>
        <i className="fa-solid fa-code text-[#00b8a3] text-sm"></i>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-200 font-bold text-base tracking-wide transition-all duration-300">
          {messages[msgIdx]}
        </span>
        <span className="text-gray-500 font-mono text-xs">This might take a few seconds...</span>
      </div>
    </div>
  );
};

const STARTER_CODE = {
  python: `def solution(nums):\n    # your code here\n    pass\n`,
  javascript: `function solution(nums) {\n    // your code here\n}\n`,
  java: `class Solution {\n    public int[] solution(int[] nums) {\n        // your code here\n    }\n}\n`,
  cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // your code here\n    }\n};\n`
};

function Ide({problem}) {
  const { name: slug } = useParams();
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const { token } = useAuth();
  
  // Console state
  const [showConsole, setShowConsole] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Load code from local storage or fallback to starter code
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${slug}_${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    } else {
      setCode(STARTER_CODE[language] || "");
    }
  }, [problem, language, slug]);

  const handleCodeChange = (value) => {
    setCode(value);
    localStorage.setItem(`code_${slug}_${language}`, value);
  };

 const executeCode = async (action) => {
    setExecutionResult({ status: 'running', action });
    setShowConsole(true);
    
    try {
      // 1. Send the code to the Queue
      const response = await fetch(`${API_URL}/api/execute`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ slug, code, action }),
      });
      
      const data = await response.json();

      // 2. If successfully queued, wait for the socket broadcast!
      if (response.status === 202 && data.jobId) {
        
        // socket.once means it will listen for this exact event ONE time, then turn off
        socket.once(`jobResult-${data.jobId}`, (result) => {
          // When the Worker finishes, it triggers this callback!
          setExecutionResult({ status: 'done', data: result });
        });

      } else {
        // If the backend threw a standard error (like 500 or 401)
        setExecutionResult({ status: 'error', error: data.error || "Failed to queue job." });
      }

    } catch (err) {
      console.error("Execution Request Failed:", err);
      setExecutionResult({ status: 'error', error: "Could not connect to the execution server." });
    }
  };

  const renderConsoleOutput = () => {
    if (!executionResult) {
      return (
         <div className="flex h-full items-center justify-center text-gray-500 font-medium">
           Run your code to see the output here.
         </div>
      );
    }

    if (executionResult.status === 'running') {
      return <LoadingState action={executionResult.action} />;
    }

    if (executionResult.status === 'error') {
      return (
        <div className="text-red-400 font-mono p-5">
          <div className="flex gap-2 items-center mb-3">
            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            <span className="font-bold text-xl">Execution Failed</span>
          </div>
          <p className="bg-red-950/30 p-4 rounded border border-red-900/50">{executionResult.error}</p>
        </div>
      );
    }

    const { data } = executionResult;
    
    if (data.success !== undefined) {
      const isSuccess = data.success;
      return (
        <div className="flex flex-col gap-5 p-5 h-full">
          <h2 className={`text-3xl font-bold flex items-center gap-3 ${isSuccess ? 'text-[#00b8a3]' : 'text-red-500'}`}>
            <i className={`fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 
            {data.status || (isSuccess ? 'Accepted' : 'Failed')}
          </h2>
          
          {data.results && (data.results.total > 0) && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-semibold text-sm">Test Cases:</span>
              <span className={`px-3 py-1 rounded text-sm font-bold border ${isSuccess ? 'bg-[#00b8a3]/10 text-[#00b8a3] border-[#00b8a3]/30' : 'bg-red-900/20 text-red-400 border-red-800/30'}`}>
                {data.results.passed} / {data.results.total} passed
              </span>
            </div>
          )}

          {data.details && data.details.javaStdErr && (
            <div className="flex flex-col gap-2 flex-1 min-h-[120px]">
               <span className="text-xs font-bold text-red-400 uppercase tracking-widest pl-1">Compile/Runtime Error</span>
               <div className="bg-red-950/20 text-red-400 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap border border-red-900/30 overflow-auto shadow-inner">
                 {stripAnsi(data.details.javaStdErr).trim()}
               </div>
            </div>
          )}

          {!isSuccess && data.rawOutput && (
            <div className="flex flex-col gap-2 flex-1 min-h-[120px]">
               <span className="text-xs font-bold uppercase tracking-widest pl-1 text-red-400">Console Output</span>
               <div className="bg-[#141414] rounded-lg p-4 font-mono text-sm whitespace-pre-wrap border overflow-auto shadow-inner text-red-200 border-red-900/30">
                 {stripAnsi(data.rawOutput).trim()}
               </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-5 overflow-auto h-full w-full">
        <pre className="text-gray-300 font-mono text-sm bg-[#141414] p-4 rounded-lg border border-[#2a2a2a]">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  const handleRun = () => executeCode("run");
  const handleSubmit = () => executeCode("submit");

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
                  onChange={handleCodeChange}
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
                <div className="flex-1 overflow-y-auto w-full">
                  {renderConsoleOutput()}
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