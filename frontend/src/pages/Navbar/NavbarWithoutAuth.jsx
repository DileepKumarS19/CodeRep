import { Link } from "react-router-dom";

function NavbarWithoutAuth() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-3 bg-[#2b2b2b] sticky top-0 z-50">
      <Link to="/" className="text-xl font-extrabold text-white tracking-tight hover:opacity-90 transition-opacity">
        Code<span className="text-[#ffa116]">Rep</span>
      </Link>

      {/* Nav links — hidden on mobile, flex on md+ */}

      {/* Buttons — hidden on mobile, flex on md+ */}
      <div className="hidden md:flex gap-2">  
        <ul className="hidden md:flex gap-7 list-none align-items-baseline">
          {[
            { label: "Problems", to: "/problems" },
            { label: "Contest", to: "#" },
            { label: "Discuss", to: "#" }
          ].map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="text-gray-400 hover:text-white text-sm font-semibold transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/signin" className="ml-5 border border-gray-600 text-gray-300 hover:border-[#ffa116] hover:text-[#ffa116] px-4 py-1.5 rounded text-sm font-semibold transition-all cursor-pointer">
          Sign In
        </Link>
        <Link to="/signup" className="bg-[#ffa116] hover:bg-[#e6911a] text-white px-4 py-1.5 rounded text-sm font-bold transition-all cursor-pointer">
          Register
        </Link>
      </div>

      {/* Hamburger — visible only on mobile (md:hidden) */}
      <div className="md:hidden flex flex-col gap-1.5 cursor-pointer">
        <span className="w-6 h-0.5 bg-gray-400 block" />
        <span className="w-6 h-0.5 bg-gray-400 block" />
        <span className="w-6 h-0.5 bg-gray-400 block" />
      </div>
    </nav>
  );
}
export default NavbarWithoutAuth;
