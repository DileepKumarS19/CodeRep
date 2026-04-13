import { Group, Panel, Separator } from "react-resizable-panels";
import ProblemDescription from "./ProblemDescription";
import Ide from "./Ide";

function SolutionPage() {
  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Navbar Placeholder */}
      <div className="h-14 bg-[#1e1e1e] border-b border-[#333] flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white text-lg tracking-tight">
            LeetCode<span className="text-[#00b8a3]">LookAlike</span>
          </span>
          <div className="h-5 w-px bg-[#333]"></div>
          <div className="flex items-center gap-2 text-sm font-semibold hover:text-white cursor-pointer transition-colors bg-[#252525] px-3 py-1.5 rounded-lg border border-[#333]">
             <i className="fa-solid fa-list text-[#00b8a3]"></i> Problem List
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-sm text-sm font-bold">
              U
           </button>
        </div>
      </div>

      {/* Main Workspace Resizable Layout */}
      <div className="flex-1 overflow-hidden p-2 min-h-0">
        <Group orientation="horizontal" className="rounded-xl overflow-hidden border border-[#333]">
          
          {/* LEFT PANEL: Problem Description */}
          <Panel defaultSize={45} minSize={20}>
            <ProblemDescription />
          </Panel>

          {/* DRAG HANDLE */}
          <Separator className="w-1.5 bg-[#0a0a0a] hover:bg-[#00b8a3] transition-colors cursor-col-resize flex flex-col items-center justify-center">
            <div className="h-8 w-0.5 bg-[#444] rounded-full"></div>
          </Separator>

          {/* RIGHT PANEL: Editor & Console */}
          <Panel defaultSize={55} minSize={30}>
            <Ide />
          </Panel>
        </Group>
      </div>
    </div>
  );
}

export default SolutionPage;