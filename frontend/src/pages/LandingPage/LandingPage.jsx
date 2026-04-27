import Body from "./Body";
import NavbarWithoutAuth from "../Navbar/NavbarWithoutAuth";
import NavbarWithAuth from "../Navbar/NavbarWithAuth";
import { useAuth } from "../../context/AuthContext";

function LandingPage(){
    const { isAuthenticated } = useAuth();
    
    return(
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
            {isAuthenticated ? <NavbarWithAuth /> : <NavbarWithoutAuth />}
            <Body/>
        </div>
    )
}
export default LandingPage;