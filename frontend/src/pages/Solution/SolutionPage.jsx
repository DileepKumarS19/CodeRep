import { Group, Panel, Separator } from "react-resizable-panels";
import ProblemDescription from "./ProblemDescription";
import Ide from "./Ide";
import NavbarWithAuth from "../Navbar/NavbarWithAuth.jsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function SolutionPage() {
  const [problem, setProblem] = useState(null);
  const name = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/problem/${name.name}`);
        const data = await response.json();
        setProblem(data.data);
      } catch (err) {
        console.error("Failed to fetch problem:", err);
      }
    };
    fetchProblem();
  }, [name.name]);

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <NavbarWithAuth />
      {/* Main Workspace Resizable Layout */}
      <div className="flex-1 overflow-hidden p-2 min-h-0">
        <Group orientation="horizontal" className="rounded-xl overflow-hidden border border-[#333]">
          
          {/* LEFT PANEL: Problem Description */}
          <Panel defaultSize={45} minSize={20}>
            <ProblemDescription problem={problem} />
          </Panel>

          {/* DRAG HANDLE */}
          <Separator className="w-1.5 bg-[#0a0a0a] hover:bg-[#00b8a3] transition-colors cursor-col-resize flex flex-col items-center justify-center">
            <div className="h-8 w-0.5 bg-[#444] rounded-full"></div>
          </Separator>

          {/* RIGHT PANEL: Editor & Console */}
          <Panel defaultSize={55} minSize={30}>
            <Ide problem={problem} />
          </Panel>
        </Group>
      </div>
    </div>
  );
}

export default SolutionPage;