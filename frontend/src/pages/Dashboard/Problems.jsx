import { useAuth } from "../../context/AuthContext";
import Hero from "./Hero";
import NavbarWithAuth from "../Navbar/NavbarWithAuth";
import NavbarWithoutAuth from "../Navbar/NavbarWithoutAuth";

function Problems() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
            {isAuthenticated ? <NavbarWithAuth /> : <NavbarWithoutAuth />}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Problems</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Solve challenges to improve your algorithmic skills and prepare for interviews.
                    </p>
                </div>
                <Hero/>
            </main>
        </div>
    )
}
export default Problems;