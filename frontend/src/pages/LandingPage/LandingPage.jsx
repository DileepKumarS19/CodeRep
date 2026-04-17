import Body from "./Body";
import NavbarWithoutAuth from "../Navbar/NavbarWithoutAuth";
function LandingPage(){
    return(
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
            <NavbarWithoutAuth/>
            <Body/>
        </div>
    )
}
export default LandingPage; 