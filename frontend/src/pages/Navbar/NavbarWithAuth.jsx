import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";


export default function NavbarWithAuth() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null); // Reference to the navbar to detect outside clicks
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };
  function ChevronDown({ size = 12 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  
  // Bell icon
  function BellIcon() {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    );
  }
  
  // Fire icon
  function FireIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c0 0-5 5.5-5 10a5 5 0 0 0 10 0C17 7.5 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-2.5 2-5 3-6.5C13 8 15 10.5 15 13a3 3 0 0 1-3 3z" fill="#ffa116"/>
      </svg>
    );
  }
  
  // LeetCode logo icon
  function LeetCodeIcon() {
    return (
      <svg width="28" height="28" viewBox="0 0 50 50" fill="none">
        <path d="M28 10L14 24l14 14" stroke="#ffa116" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 31h18" stroke="#ffa116" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    );
  }
  
  // Dropdown menu component
  function DropdownMenu({ items }) {
    return (
      <div className="absolute top-full left-0 mt-1 bg-[#282828] border border-[#3a3a3a] rounded-lg shadow-2xl py-1 min-w-[160px] z-50">
        {items.map((item) => (
          <a
            key={item}
            href="#"
            className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
    );
  }
  
  const NAV_LINKS = [
    { label: "Explore",   active: false, dropdown: null },
    { label: "Problems",  active: true,  dropdown: null },
    { label: "Contest",   active: false, dropdown: null },
    { label: "Discuss",   active: false, dropdown: null },
    {
      label: "Interview",
      active: false,
      dropdown: ["Mock Interview", "Interview Questions", "Assessment"],
    },
    {
      label: "Store",
      active: false,
      orange: true,
      dropdown: ["LeetCode Store", "Gift Cards"],
    },
  ];
  

  return (
    <nav 
      ref={navRef} 
      className="bg-[#1a1a1a] border-b border-[#2d2d2d] h-14 flex items-center px-4 md:px-6 gap-4 md:gap-6 sticky top-0 z-50"
    >
      {/* ── LOGO ─────────────────────────────────────────────────── */}
      <div className="text-xl font-extrabold text-white tracking-tight">
        Code<span className="text-[#ffa116]">Rep</span>
      </div>

      {/* ── NAV LINKS ────────────────────────────────────────────── */}
      <div className="flex-1 hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <div key={link.label} className="relative">
            <button
              onClick={() => link.dropdown && toggleDropdown(link.label)}
              className={[
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors",
                link.active
                  ? "text-white font-bold"
                  : link.orange
                    ? "text-[#ffa116] hover:bg-[#2d2d2d]"
                    : "text-gray-400 hover:text-white hover:bg-[#2d2d2d]",
              ].join(" ")}
            >
              {link.label}
              {link.dropdown && <ChevronDown />}
            </button>

            {/* Dropdown panel */}
            {link.dropdown && openDropdown === link.label && (
              <div className="absolute top-full left-0 mt-1 bg-[#282828] border border-[#3a3a3a] rounded-lg shadow-2xl py-1 min-w-[180px] z-[60]">
                {link.dropdown.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── RIGHT SIDE ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 ml-auto">
        <button 
          onClick={logout}
          className="text-gray-400 hover:text-white text-sm font-semibold transition-colors border border-gray-600 px-4 py-1.5 rounded hover:border-[#ffa116] hover:text-[#ffa116]"
        >
          Logout
        </button>
      </div>

    </nav>
  );
}