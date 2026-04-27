import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleTabSwitch = (isLoginForm) => {
    if (isLoginForm) {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      const endpoint = isLogin ? "signin" : "signup";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Authentication failed");
      }

      if (data.token) {
        login(data.token);
      } else {
        throw new Error("No token received from server");
      }

      navigate("/problems");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] px-4 py-12 selection:bg-blue-500/30">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl overflow-hidden">
        {/* Tab Header */}
        <div className="flex bg-[#252525] border-b border-[#333]">
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors focus:outline-none ${
              isLogin
                ? "text-white bg-[#1e1e1e] border-t-2 border-t-[#00b8a3]"
                : "text-gray-500 hover:text-gray-300 border-t-2 border-t-transparent"
            }`}
            onClick={() => handleTabSwitch(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors focus:outline-none ${
              !isLogin
                ? "text-white bg-[#1e1e1e] border-t-2 border-t-[#00b8a3]"
                : "text-gray-500 hover:text-gray-300 border-t-2 border-t-transparent"
            }`}
            onClick={() => handleTabSwitch(false)}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <i className={`fa-solid ${isLogin ? "fa-right-to-bracket" : "fa-user-plus"} text-xl`}></i>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isLogin ? "Welcome back" : "Join the Platform"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isLogin
                ? "Connect your IDE and continue coding."
                : "Start your journey to tech mastery today."}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                <i className="fa-solid fa-circle-exclamation text-sm"></i>
                <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-user text-gray-500 text-sm"></i>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-gray-200 focus:outline-none focus:border-[#00b8a3] focus:ring-1 focus:ring-[#00b8a3] transition-all placeholder-gray-500"
                    placeholder="Enter your username"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-envelope text-gray-500 text-sm"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-gray-200 focus:outline-none focus:border-[#00b8a3] focus:ring-1 focus:ring-[#00b8a3] transition-all placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-lock text-gray-500 text-sm"></i>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-gray-200 focus:outline-none focus:border-[#00b8a3] focus:ring-1 focus:ring-[#00b8a3] transition-all placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#00b8a3] hover:bg-[#009688] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-[0_4px_14px_0_rgba(0,184,163,0.39)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                  <i className="fa-solid fa-spinner fa-spin text-sm ml-1"></i>
                </>
              ) : isLogin ? (
                <>
                  Sign In <i className="fa-solid fa-arrow-right text-sm"></i>
                </>
              ) : (
                <>
                  Create Account <i className="fa-solid fa-user-plus text-sm"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;